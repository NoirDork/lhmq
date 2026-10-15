import assert from "node:assert/strict";
import { readdir, mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const root = "images";
const output = join(root, "optimized");
const folders = (await readdir(root, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && /^\d+\. /.test(entry.name))
  .sort((a, b) => Number.parseInt(a.name) - Number.parseInt(b.name));
let sourceBytes = 0;
let optimizedBytes = 0;
let count = 0;

async function convert(source, destination, size) {
  await mkdir(join(destination, ".."), { recursive: true });
  await sharp(source)
    .rotate()
    .resize(size, size, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(destination);
  const metadata = await sharp(destination).metadata();
  assert.ok(metadata.width <= size && metadata.height <= size);
  sourceBytes += (await stat(source)).size;
  optimizedBytes += (await stat(destination)).size;
  count++;
}

for (const folder of folders) {
  const id = Number.parseInt(folder.name);
  const files = (await readdir(join(root, folder.name)))
    .filter((name) => /\.(jpe?g|png|webp)$/i.test(name) || /^0\./.test(name))
    .sort((a, b) => a.localeCompare(b, "vi", { numeric: true }));
  const covers = files.filter((name) => /^0\./.test(name));
  assert.equal(covers.length, 1, `${folder.name}: cần đúng 1 ảnh bìa tên 0`);
  const destination = join(output, `album-${id}`);
  await convert(join(root, folder.name, covers[0]), join(destination, "cover.webp"), 960);
  const photos = files.filter((name) => name !== covers[0]);
  assert.ok(photos.length > 0, `${folder.name}: chưa có ảnh con`);
  for (const [index, name] of photos.entries()) {
    await convert(
      join(root, folder.name, name),
      join(destination, `${String(index + 1).padStart(3, "0")}.webp`),
      1600,
    );
  }
  console.log(`${folder.name}: 1 bìa + ${photos.length} ảnh con`);
}

const extras = await readdir(join(root, "ẢNH THÊM"));
for (const [prefix, name, size] of [
  ["MINH QUÂN LÀ AI_", "portrait", 800],
  ["NĂM NHẤT", "journey-1", 1600],
  ["NĂM HAI", "journey-2", 1600],
  ["NĂM BA", "journey-3", 1600],
  ["NĂM TƯ", "journey-4", 1600],
  ["TỐT NGHIỆP", "journey-5", 1600],
]) {
  const file = extras.find((file) => file.normalize("NFC").startsWith(prefix));
  assert.ok(file, `Thiếu ảnh ${prefix}`);
  await convert(join(root, "ẢNH THÊM", file), join(output, "story", `${name}.webp`), size);
}
console.log(
  `${folders.length} album, ${count} ảnh: ${(sourceBytes / 1048576).toFixed(1)} MB → ${(optimizedBytes / 1048576).toFixed(1)} MB`,
);
