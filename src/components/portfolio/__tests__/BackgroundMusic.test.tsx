import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { BackgroundMusic } from "../BackgroundMusic";

beforeEach(() => {
  const html = readFileSync("index.html", "utf8");
  const page = new DOMParser().parseFromString(html, "text/html");
  document.body.append(page.querySelector("audio")!);
});

afterEach(() => {
  cleanup();
  document.querySelector("#background-music")?.remove();
  vi.restoreAllMocks();
});

it("reuses the preloading HTML track without duplicate audio or playback controls", async () => {
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  const audio = document.querySelector("audio")!;
  expect(audio.preload).toBe("auto");
  expect(audio.autoplay).toBe(false);
  render(<BackgroundMusic />);
  await waitFor(() => expect(play).toHaveBeenCalledTimes(1));
  expect(document.querySelectorAll("audio")).toHaveLength(1);
  expect(document.querySelector("audio")).toBe(audio);
  expect(audio.volume).toBe(0.35);
  expect(audio.loop).toBe(true);
  expect(audio.controls).toBe(false);
  expect(decodeURI(audio.src)).toContain("RHYMASTIC");
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  await waitFor(() => expect(play).toHaveResolved());
  fireEvent.pointerUp(document);
  fireEvent.keyDown(document, { key: "Enter" });
  expect(play).toHaveBeenCalledTimes(1);
});

it("retries blocked autoplay on a real gesture then removes retry listeners", async () => {
  const play = vi
    .spyOn(HTMLMediaElement.prototype, "play")
    .mockRejectedValueOnce(new DOMException("Blocked", "NotAllowedError"))
    .mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  render(<BackgroundMusic />);
  await expect(play.mock.results[0].value).rejects.toHaveProperty("name", "NotAllowedError");
  await Promise.resolve();
  fireEvent.pointerUp(document);
  await waitFor(() => expect(play).toHaveBeenCalledTimes(2));
  await waitFor(() => expect(play).toHaveLastResolvedWith(undefined));
  fireEvent.pointerUp(document);
  expect(play).toHaveBeenCalledTimes(2);
});

it("supports a keyboard gesture and stops retrying after unmount", async () => {
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockRejectedValue(new Error("Blocked"));
  const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  const { unmount } = render(<BackgroundMusic />);
  await expect(play.mock.results[0].value).rejects.toThrow("Blocked");
  await Promise.resolve();
  fireEvent.keyDown(document, { key: "Enter" });
  await waitFor(() => expect(play).toHaveBeenCalledTimes(2));
  unmount();
  expect(pause).toHaveBeenCalledTimes(1);
  fireEvent.pointerUp(document);
  fireEvent.keyDown(document, { key: "Enter" });
  expect(play).toHaveBeenCalledTimes(2);
});
