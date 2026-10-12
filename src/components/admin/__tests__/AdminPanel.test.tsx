import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  signInAdmin: vi.fn(),
  fetchAdminGuests: vi.fn(),
  signOutAdmin: vi.fn(),
  buildAttendanceWorkbook: vi.fn(),
  getSession: vi.fn(),
  signOut: vi.fn(),
  unsubscribe: vi.fn(),
  listener: null as null | ((event: string, session: unknown) => void),
}));
vi.mock("@/lib/admin-rsvps", () => ({
  signInAdmin: mocks.signInAdmin,
  fetchAdminGuests: mocks.fetchAdminGuests,
  signOutAdmin: mocks.signOutAdmin,
}));
vi.mock("@/lib/attendance-export", () => ({
  buildAttendanceWorkbook: mocks.buildAttendanceWorkbook,
}));
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: mocks.getSession,
      signOut: mocks.signOut,
      onAuthStateChange: (listener: typeof mocks.listener) => {
        mocks.listener = listener;
        return { data: { subscription: { unsubscribe: mocks.unsubscribe } } };
      },
    },
  },
}));
import { AdminPanel } from "../AdminPanel";
let createObjectURL: ReturnType<typeof vi.fn>;
beforeEach(() => {
  vi.resetAllMocks();
  mocks.getSession.mockResolvedValue({ data: { session: null } });
  mocks.signInAdmin.mockResolvedValue({
    access_token: "fake-token",
    expires_at: Math.floor(Date.now() / 1000) + 60,
  });
  mocks.fetchAdminGuests.mockResolvedValue([]);
  mocks.signOutAdmin.mockResolvedValue(undefined);
  mocks.signOut.mockResolvedValue({ error: null });
  mocks.buildAttendanceWorkbook.mockResolvedValue(new ArrayBuffer(8));
  createObjectURL = vi.fn(() => "blob:test");
  Object.defineProperty(URL, "createObjectURL", { configurable: true, value: createObjectURL });
  Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});
async function login() {
  fireEvent.change(screen.getByLabelText("Tên đăng nhập"), { target: { value: "admin" } });
  fireEvent.change(screen.getByLabelText("Mật khẩu"), { target: { value: "test-only-password" } });
  fireEvent.click(screen.getByRole("button", { name: "Đăng nhập" }));
  await screen.findByRole("button", { name: "Tải Excel" });
}
it("does not fetch private data before login", async () => {
  render(<AdminPanel />);
  await act(async () => {});
  expect(screen.getByLabelText("Mật khẩu")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Tải Excel" })).not.toBeInTheDocument();
  expect(mocks.fetchAdminGuests).not.toHaveBeenCalled();
});
it("shows a generic login error and clears the entered password", async () => {
  mocks.signInAdmin.mockRejectedValue(new Error("Sensitive internals"));
  render(<AdminPanel />);
  fireEvent.change(screen.getByLabelText("Tên đăng nhập"), { target: { value: "admin" } });
  fireEvent.change(screen.getByLabelText("Mật khẩu"), { target: { value: "wrong-password" } });
  fireEvent.click(screen.getByRole("button", { name: "Đăng nhập" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Đăng nhập không thành công.");
  expect(screen.getByLabelText("Mật khẩu")).toHaveValue("");
});
it("downloads only after an authorized fresh fetch", async () => {
  render(<AdminPanel />);
  await login();
  fireEvent.click(screen.getByRole("button", { name: "Tải Excel" }));
  await waitFor(() => expect(createObjectURL).toHaveBeenCalledTimes(1));
  expect(mocks.fetchAdminGuests).toHaveBeenCalledTimes(1);
  expect(mocks.buildAttendanceWorkbook).toHaveBeenCalledWith([]);
});
it("keeps an export error retryable without downloading", async () => {
  mocks.fetchAdminGuests.mockRejectedValue(new Error("Network"));
  render(<AdminPanel />);
  await login();
  fireEvent.click(screen.getByRole("button", { name: "Tải Excel" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Không thể xuất Excel. Vui lòng thử lại.",
  );
  expect(createObjectURL).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Tải Excel" })).toBeEnabled();
});
it("cancels a workbook that finishes after logout", async () => {
  let finish!: (bytes: ArrayBuffer) => void;
  mocks.buildAttendanceWorkbook.mockReturnValue(
    new Promise<ArrayBuffer>((resolve) => {
      finish = resolve;
    }),
  );
  render(<AdminPanel />);
  await login();
  fireEvent.click(screen.getByRole("button", { name: "Tải Excel" }));
  await waitFor(() => expect(mocks.buildAttendanceWorkbook).toHaveBeenCalled());
  fireEvent.click(screen.getByRole("button", { name: "Đăng xuất" }));
  await act(async () => finish(new ArrayBuffer(8)));
  expect(createObjectURL).not.toHaveBeenCalled();
  expect(screen.getByLabelText("Mật khẩu")).toBeInTheDocument();
});
it("expires access and cancels an in-flight workbook", async () => {
  vi.useFakeTimers();
  mocks.signInAdmin.mockResolvedValue({
    access_token: "fake-token",
    expires_at: Math.floor(Date.now() / 1000) + 1,
  });
  let finish!: (bytes: ArrayBuffer) => void;
  mocks.buildAttendanceWorkbook.mockReturnValue(
    new Promise<ArrayBuffer>((resolve) => {
      finish = resolve;
    }),
  );
  render(<AdminPanel />);
  fireEvent.change(screen.getByLabelText("Tên đăng nhập"), { target: { value: "admin" } });
  fireEvent.change(screen.getByLabelText("Mật khẩu"), { target: { value: "test-only-password" } });
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Đăng nhập" })));
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Tải Excel" })));
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1100);
    finish(new ArrayBuffer(8));
  });
  expect(screen.getByLabelText("Mật khẩu")).toBeInTheDocument();
  expect(createObjectURL).not.toHaveBeenCalled();
});
it("signs out a login that completes after leaving the admin page", async () => {
  let finish!: (value: unknown) => void;
  mocks.signInAdmin.mockReturnValue(
    new Promise((resolve) => {
      finish = resolve;
    }),
  );
  const view = render(<AdminPanel />);
  fireEvent.change(screen.getByLabelText("Tên đăng nhập"), { target: { value: "admin" } });
  fireEvent.change(screen.getByLabelText("Mật khẩu"), { target: { value: "test-only-password" } });
  fireEvent.click(screen.getByRole("button", { name: "Đăng nhập" }));
  view.unmount();
  await act(async () => finish({ access_token: "fake-token", expires_at: 2000000000 }));
  expect(mocks.signOutAdmin).toHaveBeenCalled();
  expect(mocks.unsubscribe).toHaveBeenCalled();
});
