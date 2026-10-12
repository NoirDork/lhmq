import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, expect, it, vi } from "vitest";
const { fetchGuests } = vi.hoisted(() => ({ fetchGuests: vi.fn() }));
vi.mock("@/lib/rsvps", () => ({ fetchGuests }));
import { GuestList } from "../GuestList";
beforeAll(() =>
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
  }),
);
beforeEach(() => vi.resetAllMocks());
afterEach(() => cleanup());
const guest = {
  id: 101,
  guest_name: "Cô Hà",
  message: "<img src=x onerror=alert(1)>\nChúc con luôn vững vàng!",
  created_at: "2026-10-12T00:00:00Z",
};

it("opens literal multiline text and returns focus to the envelope after Escape", async () => {
  fetchGuests.mockResolvedValue([guest]);
  render(<GuestList />);
  const envelope = await screen.findByRole("button", { name: "Mở thư của Cô Hà" });
  envelope.focus();
  fireEvent.click(envelope);
  const dialog = screen.getByRole("dialog", { name: "Lời chúc từ Cô Hà" });
  expect(dialog.querySelector("img, script")).toBeNull();
  expect(dialog.querySelector("[data-letter-message]")?.textContent).toBe(guest.message);
  fireEvent(dialog, new Event("cancel", { cancelable: true }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(envelope).toHaveFocus();
  expect(document.body.style.overflow).not.toBe("hidden");
});

it("keeps duplicate-name letters separate and retains a 4000-character wish", async () => {
  fetchGuests.mockResolvedValue([guest, { ...guest, id: 102, message: "x".repeat(4000) }]);
  render(<GuestList />);
  const envelopes = await screen.findAllByRole("button", { name: "Mở thư của Cô Hà" });
  fireEvent.click(envelopes[1]);
  expect(screen.getByRole("heading", { name: "Lời chúc từ Cô Hà" })).toHaveFocus();
  expect(screen.getByRole("dialog").querySelector("[data-letter-message]")?.textContent).toBe(
    "x".repeat(4000),
  );
  fireEvent.click(screen.getByRole("button", { name: "Đóng thư" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.queryByText(/Attending|Not Attending/)).not.toBeInTheDocument();
});

it("keeps the empty state and refreshes after a saved wish", async () => {
  fetchGuests.mockResolvedValueOnce([]).mockResolvedValueOnce([guest]);
  render(<GuestList />);
  expect(
    await screen.findByText("Chưa có phản hồi nào. Hãy là người đầu tiên!"),
  ).toBeInTheDocument();
  await act(async () => window.dispatchEvent(new CustomEvent("guest-submitted")));
  expect(await screen.findByRole("button", { name: "Mở thư của Cô Hà" })).toBeInTheDocument();
});
