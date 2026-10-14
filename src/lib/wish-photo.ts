export async function prepareWishPhoto(file: File): Promise<Blob> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Vui lòng chọn ảnh JPG, PNG hoặc WebP.");
  }
  if (!file.size || file.size > 5 * 1024 * 1024) {
    throw new Error("Ảnh phải nhỏ hơn hoặc bằng 5 MB.");
  }
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("Không đọc được ảnh. Vui lòng chọn ảnh khác.");
  }
  try {
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Không xử lý được ảnh trên trình duyệt này.");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    // Re-encoding removes EXIF/location metadata and keeps uploads lightweight.
    const photo = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.82),
    );
    if (!photo || photo.size > 2 * 1024 * 1024)
      throw new Error("Ảnh quá lớn sau khi xử lý. Vui lòng chọn ảnh khác.");
    return photo;
  } finally {
    bitmap.close();
  }
}
