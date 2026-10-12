import { beforeEach, expect, it, vi } from "vitest";

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock("@/lib/supabase", () => ({ supabase: { rpc } }));
import { submitRsvp, fetchGuests } from "../rsvps";

beforeEach(() => vi.resetAllMocks());

it("saves the complete wish with explicit publication consent", async () => {
  rpc.mockResolvedValue({ error: null });
  await submitRsvp({
    guestName: "Cô Hà",
    attendingStatus: "Not Attending",
    email: "ha@example.com",
    message: "Chúc mừng con!",
    relationship: "Thầy cô",
  });
  expect(rpc).toHaveBeenCalledWith("submit_rsvp", {
    p_guest_name: "Cô Hà",
    p_attending_status: "Not Attending",
    p_email: "ha@example.com",
    p_message: "Chúc mừng con!",
    p_relationship: "Thầy cô",
    p_publish_message: true,
  });
});

it("keeps database errors visible to the form", async () => {
  const error = { code: "23505" };
  rpc.mockResolvedValue({ error });
  await expect(
    submitRsvp({
      guestName: "Hà",
      attendingStatus: "Attending",
      email: "ha@example.com",
      message: "Chúc mừng",
      relationship: "Bạn",
    }),
  ).rejects.toBe(error);
});

it("returns an empty public list rather than null", async () => {
  rpc.mockResolvedValue({ data: null, error: null });
  expect(await fetchGuests()).toEqual([]);
});

it("reads public wishes through the protected database function", async () => {
  const guests = [{ id: 1, guest_name: "Minh Quân", message: "Chúc mừng!", created_at: "2026-08-28T00:00:00Z" }];
  rpc.mockResolvedValue({ data: guests, error: null });
  expect(await fetchGuests()).toEqual(guests);
  expect(rpc).toHaveBeenCalledWith("get_public_rsvps");
});
