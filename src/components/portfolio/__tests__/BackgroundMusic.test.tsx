import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { BackgroundMusic } from "../BackgroundMusic";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("starts the new track automatically without playback controls", async () => {
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  const { container } = render(<BackgroundMusic />);
  const audio = container.querySelector("audio")!;
  await waitFor(() => expect(play).toHaveBeenCalledTimes(1));
  expect(audio.autoplay).toBe(true);
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
