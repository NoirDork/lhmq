import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { BackgroundMusic } from "../BackgroundMusic";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("plays only on request and lets the guest pause", async () => {
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function (
    this: HTMLMediaElement,
  ) {
    this.dispatchEvent(new Event("play"));
    return Promise.resolve();
  });
  const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(function (
    this: HTMLMediaElement,
  ) {
    this.dispatchEvent(new Event("pause"));
  });
  const { container } = render(<BackgroundMusic />);
  expect(play).not.toHaveBeenCalled();
  const audio = container.querySelector("audio")!;
  expect(audio.autoplay).toBe(false);
  expect(audio.preload).toBe("none");
  expect(audio.loop).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: /Bật nhạc nền/ }));
  await waitFor(() =>
    expect(screen.getByRole("button", { name: /Tắt nhạc nền/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    ),
  );
  expect(play).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: /Tắt nhạc nền/ }));
  expect(pause).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("button", { name: /Bật nhạc nền/ })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
});

it("reports a blocked playback and allows retry", async () => {
  vi.spyOn(HTMLMediaElement.prototype, "play")
    .mockRejectedValueOnce(new Error("NotAllowedError"))
    .mockImplementationOnce(function (this: HTMLMediaElement) {
      this.dispatchEvent(new Event("play"));
      return Promise.resolve();
    });
  render(<BackgroundMusic />);
  fireEvent.click(screen.getByRole("button", { name: /Bật nhạc nền/ }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Không phát được nhạc");
  fireEvent.click(screen.getByRole("button", { name: /Bật nhạc nền/ }));
  await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
  expect(screen.getByRole("button", { name: /Tắt nhạc nền/ })).toBeEnabled();
});

it("resets the control if the audio file fails to load", () => {
  const { container } = render(<BackgroundMusic />);
  fireEvent.error(container.querySelector("audio")!);
  expect(screen.getByRole("alert")).toHaveTextContent("Không phát được nhạc");
  expect(screen.getByRole("button", { name: /Bật nhạc nền/ })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
});
