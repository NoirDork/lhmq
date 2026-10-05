import { describe, expect, it, vi } from "vitest";

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));

vi.mock("@/lib/supabase", () => ({
  supabase: { rpc },
}));

import { fetchGuests, submitRsvp } from "../rsvps";

describe("RSVP data access", () => {
  it("submits an RSVP through the protected database function", async () => {
    rpc.mockResolvedValueOnce({ error: null });

    await submitRsvp({
      guestName: "Minh Quân",
      attendingStatus: "Attending",
      email: "quan@example.com",
      message: "Chúc mừng tốt nghiệp!",
      relationship: "Bạn bè",
    });

    expect(rpc).toHaveBeenCalledWith("submit_rsvp", {
      p_guest_name: "Minh Quân",
      p_attending_status: "Attending",
      p_email: "quan@example.com",
      p_message: "Chúc mừng tốt nghiệp!",
      p_relationship: "Bạn bè",
    });
  });

  it("returns only public guest fields from the protected database function", async () => {
    const guests = [
      {
        guest_name: "Minh Quân",
        attending_status: "Attending",
        created_at: "2026-08-28T00:00:00Z",
      },
    ];
    rpc.mockResolvedValueOnce({ data: guests, error: null });

    await expect(fetchGuests()).resolves.toEqual(guests);
    expect(rpc).toHaveBeenCalledWith("get_public_rsvps");
  });
});
