import { expect, it } from "vitest";
import { memories } from "../memories";

it("maps all nine supplied albums in number order with every child photo", () => {
  expect(memories.map((memory) => memory.images.length)).toEqual([
    15, 14, 41, 16, 10, 11, 21, 35, 27,
  ]);
  expect(new Set(memories.map((memory) => memory.slug)).size).toBe(9);
  for (const memory of memories) {
    expect(memory.cover).toContain("cover.webp");
    expect(memory.images).not.toContain(memory.cover);
    expect(new Set(memory.images).size).toBe(memory.images.length);
  }
});
