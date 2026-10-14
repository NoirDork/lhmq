import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const { submitRsvp, fetchGuests, createConfetti, burst, prepareWishPhoto } = vi.hoisted(() => ({
  submitRsvp: vi.fn(),
  fetchGuests: vi.fn(),
  createConfetti: vi.fn(),
  burst: Object.assign(vi.fn(), { reset: vi.fn() }),
  prepareWishPhoto: vi.fn(),
}));

vi.mock("@/lib/rsvps", () => ({ submitRsvp, fetchGuests }));
vi.mock("@/lib/wish-photo", () => ({ prepareWishPhoto }));
vi.mock("canvas-confetti", () => ({ default: Object.assign(vi.fn(), { create: createConfetti }) }));

import { GuestList } from "../GuestList";
let ContactForm: typeof import("../ContactForm").ContactForm;

beforeAll(async () => {
  // jsdom does not implement the browser's dialog methods.
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: {
      configurable: true,
      value() {
        this.setAttribute("open", "");
      },
    },
    close: {
      configurable: true,
      value() {
        this.removeAttribute("open");
      },
    },
  });
  ({ ContactForm } = await import("../ContactForm"));
});

beforeEach(() => {
  vi.resetAllMocks();
  createConfetti.mockReturnValue(burst);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function fillForm() {
  fireEvent.change(screen.getByLabelText("Minh Quân gọi đằng ấy là gì tar"), {
    target: { value: "Khách kiểm thử" },
  });
  fireEvent.change(screen.getByLabelText("Mối quan hệ"), { target: { value: "Bạn bè" } });
  fireEvent.change(screen.getByLabelText("Lời nhắn hay lời chúc"), {
    target: { value: "Chúc mừng tốt nghiệp!" },
  });
  const form = screen.getByRole("button", { name: "Gửi lời chúc" }).closest("form")!;
  return form;
}

describe("RSVP flow", () => {
  it("clears a rejected-photo error when a valid replacement is ready", async () => {
    vi.stubGlobal(
      "URL",
      class extends URL {
        static createObjectURL() {
          return "blob:valid-photo";
        }
        static revokeObjectURL() {}
      },
    );
    prepareWishPhoto
      .mockRejectedValueOnce(new Error("Ảnh không hợp lệ"))
      .mockResolvedValueOnce(new Blob(["photo"], { type: "image/jpeg" }));
    render(<ContactForm />);
    const input = screen.getByLabelText("Ảnh kỷ niệm (không bắt buộc)");
    fireEvent.change(input, { target: { files: [new File(["bad"], "bad.jpg")] } });
    expect(await screen.findByRole("alert")).toHaveTextContent("Ảnh không hợp lệ");
    fireEvent.change(input, { target: { files: [new File(["photo"], "good.jpg")] } });
    expect(await screen.findByRole("img", { name: "Ảnh kỷ niệm đã chọn" })).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Bỏ ảnh" }));
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
  it("locks duplicate submission while saving and refreshes guests after success", async () => {
    let finishSave!: () => void;
    submitRsvp.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finishSave = resolve;
        }),
    );
    vi.spyOn(console, "warn").mockImplementation(() => {});
    let refreshed = false;
    const onSubmitted = () => {
      refreshed = true;
    };
    window.addEventListener("guest-submitted", onSubmitted, { once: true });
    render(<ContactForm />);
    const form = fillForm();
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(submitRsvp).toHaveBeenCalledTimes(1);

    expect(screen.getByRole("button", { name: /Đang gửi/ })).toBeDisabled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(submitRsvp).toHaveBeenCalledWith({
      guestName: "Khách kiểm thử",
      requestId: expect.any(String),
      photo: undefined,
      message: "Chúc mừng tốt nghiệp!",
      relationship: "Bạn bè",
    });
    await act(async () => finishSave());

    expect(
      await screen.findByRole("dialog", { name: "Gửi lời chúc thành công" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Lời nhắn hay lời chúc")).toHaveValue("");
    expect(refreshed).toBe(true);
    window.removeEventListener("guest-submitted", onSubmitted);
  });

  it.each([
    ["P0001", "Không thể lưu lời chúc. Vui lòng thử lại."],
    ["23505", "Không thể lưu lời chúc. Vui lòng thử lại."],
  ])("keeps the written message when database saving fails with %s", async (code, message) => {
    submitRsvp.mockRejectedValueOnce({ code, message: "Database error" });
    render(<ContactForm />);
    fireEvent.submit(fillForm());

    expect(await screen.findByRole("alert")).toHaveTextContent(message);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Lời nhắn hay lời chúc")).toHaveValue("Chúc mừng tốt nghiệp!");
    expect(screen.getByRole("button", { name: "Gửi lời chúc" })).toBeEnabled();
  });

  it("allows wishes without email or attendance and explains public photo sharing", () => {
    render(<ContactForm />);
    expect(screen.queryByLabelText("Tham dự")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Ảnh kỷ niệm (không bắt buộc)")).not.toBeRequired();
    expect(screen.getByText(/ảnh đính kèm sẽ hiển thị công khai/)).toBeInTheDocument();
    expect(fillForm().checkValidity()).toBe(true);
  });

  it("shows the success popup with confetti and lets the guest dismiss it", async () => {
    submitRsvp.mockResolvedValueOnce(undefined);
    render(<ContactForm />);
    screen.getByRole("button", { name: "Gửi lời chúc" }).focus();
    fireEvent.submit(fillForm());

    const dialog = await screen.findByRole("dialog", { name: "Gửi lời chúc thành công" });
    expect(dialog).toHaveAttribute("open");
    expect(dialog.querySelector("#rsvp-confirmation-description")?.textContent).toBe(
      "Cảm ơn Thầy Cô anh chị em bạn dì cô chú đã cùng đồng hành, hỗ trợ và chở che con/em trong suốt hành trình thanh xuân vừa qua để hôm nay có một phiên bản trưởng thành, vững vàng và rực rỡ nhất <3.",
    );
    expect(createConfetti).toHaveBeenCalledWith(dialog.querySelector("canvas"), { resize: true });
    expect(burst).toHaveBeenCalledWith(expect.objectContaining({ particleCount: 80 }));
    expect(dialog.querySelector("[data-rain-icon]")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Đóng" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Gửi lời chúc" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Gửi lời chúc" })).toHaveFocus();
    expect(burst.reset).toHaveBeenCalled();
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("dismisses the popup when the browser sends an Escape cancellation", async () => {
    submitRsvp.mockResolvedValueOnce(undefined);
    render(<ContactForm />);
    fireEvent.submit(fillForm());

    fireEvent(await screen.findByRole("dialog"), new Event("cancel", { cancelable: true }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps the popup without particles for reduced motion", async () => {
    const matchMedia = window.matchMedia;
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      ...matchMedia(query),
      matches: query.includes("prefers-reduced-motion"),
    }));
    submitRsvp.mockResolvedValueOnce(undefined);
    render(<ContactForm />);
    fireEvent.submit(fillForm());

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAttribute("open");
    expect(dialog.querySelector("canvas, [data-rain-icon]")).toBeNull();
    expect(createConfetti).not.toHaveBeenCalled();
  });

  it("reloads the guest list after a failed request", async () => {
    fetchGuests.mockRejectedValueOnce(new Error("Network unavailable"));
    fetchGuests.mockResolvedValueOnce([
      {
        guest_name: "Khách đã lưu",
        id: 101,
        message: "Chúc mừng!",
        created_at: "2026-10-05T00:00:00Z",
      },
    ]);
    render(<GuestList />);

    fireEvent.click(await screen.findByRole("button", { name: "Thử lại" }));
    await waitFor(() => expect(screen.getByText("Khách đã lưu")).toBeInTheDocument());
    expect(screen.queryByText("Không thể tải danh sách khách mời.")).not.toBeInTheDocument();
  });
});
