import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const { submitRsvp, fetchGuests, sendEmail, createConfetti, burst } = vi.hoisted(() => ({
  submitRsvp: vi.fn(),
  fetchGuests: vi.fn(),
  sendEmail: vi.fn(),
  createConfetti: vi.fn(),
  burst: Object.assign(vi.fn(), { reset: vi.fn() }),
}));

vi.mock("@/lib/rsvps", () => ({ submitRsvp, fetchGuests }));
vi.mock("@emailjs/browser", () => ({ default: { send: sendEmail } }));
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
  vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "test-service");
  vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", "test-template");
  vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "test-key");
  ({ ContactForm } = await import("../ContactForm"));
});

beforeEach(() => {
  vi.resetAllMocks();
  createConfetti.mockReturnValue(burst);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
afterAll(() => vi.unstubAllEnvs());

function fillForm(attendance = "Attending") {
  fireEvent.change(screen.getByLabelText("Tên của bạn"), { target: { value: "Khách kiểm thử" } });
  fireEvent.change(screen.getByLabelText("Mối quan hệ"), { target: { value: "Bạn bè" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByLabelText("Lời nhắn hay lời chúc"), {
    target: { value: "Chúc mừng tốt nghiệp!" },
  });
  const form = screen.getByRole("button", { name: "Gửi lời chúc" }).closest("form")!;
  fireEvent.change(form.querySelector('[name="attendance"]')!, { target: { value: attendance } });
  return form;
}

describe("RSVP flow", () => {
  it("locks submission while saving and refreshes guests even if the notification email fails", async () => {
    let finishSave!: () => void;
    submitRsvp.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finishSave = resolve;
        }),
    );
    sendEmail.mockRejectedValueOnce(new Error("Notification unavailable"));
    vi.spyOn(console, "warn").mockImplementation(() => {});
    let refreshed = false;
    const onSubmitted = () => {
      refreshed = true;
    };
    window.addEventListener("guest-submitted", onSubmitted, { once: true });
    render(<ContactForm />);
    fireEvent.submit(fillForm());

    expect(screen.getByRole("button", { name: /Đang gửi/ })).toBeDisabled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(submitRsvp).toHaveBeenCalledWith({
      guestName: "Khách kiểm thử",
      attendingStatus: "Attending",
      email: "test@example.com",
      message: "Chúc mừng tốt nghiệp!",
      relationship: "Bạn bè",
    });
    await act(async () => finishSave());

    expect(await screen.findByText("Cảm ơn bạn đã gửi lời chúc.")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Lời nhắn hay lời chúc")).toHaveValue("");
    expect(refreshed).toBe(true);
    window.removeEventListener("guest-submitted", onSubmitted);
  });

  it.each([
    ["P0001", "Không thể lưu lời chúc. Vui lòng thử lại."],
    ["23505", "Email này đã được dùng để RSVP trước đó."],
  ])("keeps the written message when database saving fails with %s", async (code, message) => {
    submitRsvp.mockRejectedValueOnce({ code, message: "Database error" });
    render(<ContactForm />);
    fireEvent.submit(fillForm());

    expect(await screen.findByRole("alert")).toHaveTextContent(message);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Lời nhắn hay lời chúc")).toHaveValue("Chúc mừng tốt nghiệp!");
    expect(screen.getByRole("button", { name: "Gửi lời chúc" })).toBeEnabled();
  });

  it("requires an attendance choice using the native select", () => {
    render(<ContactForm />);
    const select = screen.getByLabelText("Tham dự") as HTMLSelectElement;
    expect(select.tagName).toBe("SELECT");
    expect(screen.queryByRole("option", { name: "Có thể" })).not.toBeInTheDocument();
    expect(select.checkValidity()).toBe(false);
    fireEvent.change(select, { target: { value: "Not Attending" } });
    expect(select.checkValidity()).toBe(true);
  });

  it.each([
    ["Attending", "Cảm ơn sự hiện diện của bạn vào ngày trọng đại của mình."],
    ["Not Attending", "Thật tiếc khi không có bạn bên cạnh."],
  ])(
    "shows the matching popup after saving %s and lets the guest dismiss it",
    async (attendance, title) => {
      submitRsvp.mockResolvedValueOnce(undefined);
      sendEmail.mockResolvedValueOnce(undefined);
      render(<ContactForm />);
      fireEvent.submit(fillForm(attendance));

      const dialog = await screen.findByRole("dialog", { name: title });
      expect(dialog).toHaveAttribute("open");
      expect(screen.getByLabelText("Tham dự")).toHaveValue("");
      if (attendance === "Attending") {
        expect(createConfetti).toHaveBeenCalledWith(dialog.querySelector("canvas"), {
          resize: true,
        });
        expect(burst).toHaveBeenCalledWith(expect.objectContaining({ particleCount: 80 }));
        expect(dialog.querySelector("[data-rain-icon]")).toBeNull();
      } else {
        expect(dialog.querySelectorAll("[data-rain-icon]").length).toBeGreaterThan(0);
        expect(createConfetti).not.toHaveBeenCalled();
      }

      fireEvent.click(screen.getByRole("button", { name: "Đóng" }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Gửi lời chúc" })).toBeEnabled();
      if (attendance === "Attending") expect(burst.reset).toHaveBeenCalled();
    },
  );

  it("dismisses the popup when the browser sends an Escape cancellation", async () => {
    submitRsvp.mockResolvedValueOnce(undefined);
    sendEmail.mockResolvedValueOnce(undefined);
    render(<ContactForm />);
    fireEvent.submit(fillForm());

    fireEvent(await screen.findByRole("dialog"), new Event("cancel", { cancelable: true }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it.each(["Attending", "Not Attending"])(
    "keeps the %s popup without particles for reduced motion",
    async (attendance) => {
      const matchMedia = window.matchMedia;
      vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
        ...matchMedia(query),
        matches: query.includes("prefers-reduced-motion"),
      }));
      submitRsvp.mockResolvedValueOnce(undefined);
      sendEmail.mockResolvedValueOnce(undefined);
      render(<ContactForm />);
      fireEvent.submit(fillForm(attendance));

      const dialog = await screen.findByRole("dialog");
      expect(dialog).toHaveAttribute("open");
      expect(dialog.querySelector("canvas, [data-rain-icon]")).toBeNull();
      expect(createConfetti).not.toHaveBeenCalled();
    },
  );

  it("reloads the guest list after a failed request", async () => {
    fetchGuests.mockRejectedValueOnce(new Error("Network unavailable"));
    fetchGuests.mockResolvedValueOnce([
      {
        guest_name: "Khách đã lưu",
        attending_status: "Attending",
        created_at: "2026-10-05T00:00:00Z",
      },
    ]);
    render(<GuestList />);

    fireEvent.click(await screen.findByRole("button", { name: "Thử lại" }));
    await waitFor(() => expect(screen.getByText("Khách đã lưu")).toBeInTheDocument());
    expect(screen.queryByText("Không thể tải danh sách khách mời.")).not.toBeInTheDocument();
  });
});
