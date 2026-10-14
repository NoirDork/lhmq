import { beforeEach, expect, it, vi } from "vitest";
const { rpc, upload, getPublicUrl } = vi.hoisted(() => ({
  rpc: vi.fn(),
  upload: vi.fn(),
  getPublicUrl: vi.fn(),
}));
vi.mock("@/lib/supabase", () => ({
  supabase: { rpc, storage: { from: () => ({ upload, getPublicUrl }) } },
}));
import { submitRsvp, fetchGuests } from "../rsvps";
const wish = {
  requestId: "11111111-1111-4111-8111-111111111111",
  guestName: "Cô Hà",
  message: "Chúc mừng con!",
  relationship: "Thầy cô",
};
beforeEach(() => vi.resetAllMocks());
it("publishes a text-only wish without collecting email or attendance", async () => {
  rpc.mockResolvedValueOnce({ data: { published: true, photo_path: null }, error: null });
  await submitRsvp(wish);
  expect(rpc).toHaveBeenCalledWith("begin_wish", {
    p_request_id: wish.requestId,
    p_guest_name: "Cô Hà",
    p_message: "Chúc mừng con!",
    p_relationship: "Thầy cô",
    p_has_photo: false,
  });
  expect(upload).not.toHaveBeenCalled();
});
it("does not publish a letter when its photo upload fails", async () => {
  rpc.mockResolvedValueOnce({
    data: { published: false, photo_path: "photo.jpg", photo_uploaded: false },
    error: null,
  });
  const error = new Error("offline");
  upload.mockResolvedValue({ error });
  await expect(submitRsvp({ ...wish, photo: new Blob(["photo"]) })).rejects.toBe(error);
  expect(rpc).not.toHaveBeenCalledWith("publish_wish", expect.anything());
});
it("publishes only after upload succeeds and never overwrites an image", async () => {
  rpc
    .mockResolvedValueOnce({
      data: { published: false, photo_path: "photo.jpg", photo_uploaded: false },
      error: null,
    })
    .mockResolvedValueOnce({ error: null });
  upload.mockResolvedValue({ error: null });
  const photo = new Blob(["photo"]);
  await submitRsvp({ ...wish, photo });
  expect(upload).toHaveBeenCalledWith("photo.jpg", photo, {
    contentType: "image/jpeg",
    upsert: false,
  });
  expect(rpc).toHaveBeenLastCalledWith("publish_wish", { p_request_id: wish.requestId });
});
it("retries publication without uploading again after a lost response", async () => {
  rpc
    .mockResolvedValueOnce({
      data: { published: false, photo_path: "photo.jpg", photo_uploaded: true },
      error: null,
    })
    .mockResolvedValueOnce({ error: null });
  await submitRsvp({ ...wish, photo: new Blob(["photo"]) });
  expect(upload).not.toHaveBeenCalled();
  expect(rpc).toHaveBeenLastCalledWith("publish_wish", { p_request_id: wish.requestId });
});
it("keeps backend errors visible and returns empty lists safely", async () => {
  const error = new Error("offline");
  rpc.mockResolvedValueOnce({ error });
  await expect(submitRsvp(wish)).rejects.toBe(error);
  rpc.mockResolvedValueOnce({ data: null, error: null });
  expect(await fetchGuests()).toEqual([]);
});
it("maps only this bucket's stored photo path into the public URL", async () => {
  rpc.mockResolvedValueOnce({
    data: [{ id: 1, guest_name: "Hà", message: "Chúc mừng", photo_path: "photo.jpg" }],
    error: null,
  });
  getPublicUrl.mockReturnValue({
    data: {
      publicUrl: "https://example.supabase.co/storage/v1/object/public/wish-photos/photo.jpg",
    },
  });
  expect((await fetchGuests())[0].photo_url).toContain("/wish-photos/photo.jpg");
  expect(getPublicUrl).toHaveBeenCalledWith("photo.jpg");
});
