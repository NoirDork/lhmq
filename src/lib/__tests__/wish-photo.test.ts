import { expect, it } from "vitest";
import { prepareWishPhoto } from "../wish-photo";
it("rejects executable/non-image files before decoding", async () => {
  await expect(
    prepareWishPhoto(new File(["<svg/>"], "photo.svg", { type: "image/svg+xml" })),
  ).rejects.toThrow("JPG, PNG hoặc WebP");
});
it("rejects oversized and empty images before decoding", async () => {
  await expect(
    prepareWishPhoto(new File([new Uint8Array(5242881)], "big.jpg", { type: "image/jpeg" })),
  ).rejects.toThrow("5 MB");
  await expect(prepareWishPhoto(new File([], "empty.jpg", { type: "image/jpeg" }))).rejects.toThrow(
    "5 MB",
  );
});
it("reports undecodable images without crashing the form", async () => {
  await expect(
    prepareWishPhoto(new File(["broken"], "broken.jpg", { type: "image/jpeg" })),
  ).rejects.toThrow("Không đọc được ảnh");
});
