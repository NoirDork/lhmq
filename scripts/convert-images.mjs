import sharp from "sharp";
import { join } from "path";

const inputPath = join("images", "hand-sig", "hand-sig.png");
const outputDir = join("public", "images", "hand-sig");

await sharp(inputPath).webp({ quality: 80 }).toFile(join(outputDir, "hand-sig.webp"));

await sharp(inputPath).avif({ quality: 50 }).toFile(join(outputDir, "hand-sig.avif"));

const metadata = await sharp(inputPath).metadata();
console.log(`Converted: ${metadata.width}x${metadata.height}`);
console.log("WebP: public/images/hand-sig/hand-sig.webp");
console.log("AVIF: public/images/hand-sig/hand-sig.avif");
