import { useEffect, type ReactNode } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { AlbumCarousel } from "../AlbumCarousel";

const embla = vi.hoisted(() => {
  const listeners = new Map<string, Set<() => void>>();
  let selected = 0;
  let imageCount = 3;
  const select = (index: number) => {
    selected = index;
    listeners.get("select")?.forEach((listener) => listener());
  };
  return {
    reset: (count = 3) => {
      selected = 0;
      imageCount = count;
      listeners.clear();
    },
    api: {
      selectedScrollSnap: () => selected,
      scrollNext: vi.fn(() => select((selected + 1) % imageCount)),
      scrollTo: vi.fn(select),
      on: (event: string, listener: () => void) => {
        if (!listeners.has(event)) listeners.set(event, new Set());
        listeners.get(event)!.add(listener);
      },
      off: vi.fn((event: string, listener: () => void) => listeners.get(event)?.delete(listener)),
    },
  };
});

vi.mock("@/components/ui/carousel", () => ({
  Carousel: ({ children, setApi }: { children: ReactNode; setApi: (api: unknown) => void }) => {
    useEffect(() => setApi(embla.api), [setApi]);
    return <div>{children}</div>;
  },
  CarouselContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CarouselItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CarouselPrevious: () => null,
  CarouselNext: () => null,
}));

const memory = {
  slug: "test",
  title: "Album",
  cover: "/cover.webp",
  images: ["/1.webp", "/2.webp", "/3.webp"],
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  embla.reset();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

it("advances every five seconds and updates the selected node, including wraparound", () => {
  render(<AlbumCarousel memory={memory} />);
  expect(screen.getByRole("button", { name: "Xem ảnh 1" })).toHaveAttribute("aria-current", "true");
  act(() => vi.advanceTimersByTime(4999));
  expect(embla.api.scrollNext).not.toHaveBeenCalled();
  act(() => vi.advanceTimersByTime(1));
  expect(screen.getByRole("button", { name: "Xem ảnh 2" })).toHaveAttribute("aria-current", "true");
  act(() => vi.advanceTimersByTime(5000));
  act(() => vi.advanceTimersByTime(5000));
  expect(screen.getByRole("button", { name: "Xem ảnh 1" })).toHaveAttribute("aria-current", "true");
  expect(screen.queryByText(/Ảnh \d+ \/ \d+/)).not.toBeInTheDocument();
});

it("lets a guest choose a node and gives the new image a full five seconds", () => {
  render(<AlbumCarousel memory={memory} />);
  act(() => vi.advanceTimersByTime(4000));
  fireEvent.click(screen.getByRole("button", { name: "Xem ảnh 3" }));
  expect(embla.api.scrollTo).toHaveBeenCalledWith(2);
  act(() => vi.advanceTimersByTime(4999));
  expect(embla.api.scrollNext).not.toHaveBeenCalled();
  act(() => vi.advanceTimersByTime(1));
  expect(embla.api.scrollNext).toHaveBeenCalledTimes(1);
});

it("removes the timer/listeners when leaving the album and has no playback toggle", () => {
  const { unmount } = render(<AlbumCarousel memory={memory} />);
  expect(screen.queryByRole("button", { name: /trình chiếu/ })).not.toBeInTheDocument();
  act(() => vi.advanceTimersByTime(5000));
  expect(embla.api.scrollNext).toHaveBeenCalledTimes(1);
  unmount();
  act(() => vi.advanceTimersByTime(10000));
  expect(embla.api.scrollNext).toHaveBeenCalledTimes(1);
  expect(embla.api.off).toHaveBeenCalledWith("select", expect.any(Function));
  expect(embla.api.off).toHaveBeenCalledWith("reInit", expect.any(Function));
});

it("resets the five-second delay on carousel selection events from manual navigation", () => {
  render(<AlbumCarousel memory={memory} />);
  act(() => vi.advanceTimersByTime(4000));
  act(() => embla.api.scrollTo(1));
  act(() => vi.advanceTimersByTime(4999));
  expect(embla.api.scrollNext).not.toHaveBeenCalled();
  act(() => vi.advanceTimersByTime(1));
  expect(embla.api.scrollNext).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("button", { name: "Xem ảnh 3" })).toHaveAttribute("aria-current", "true");
});

it("shows five nodes and pins the active node in slot three after reaching it, both directions and across the loop", () => {
  embla.reset(9);
  render(
    <AlbumCarousel
      memory={{ ...memory, images: Array.from({ length: 9 }, (_, i) => `/${i + 1}.webp`) }}
    />,
  );
  const nodes = () => screen.getAllByRole("button", { name: /^Xem ảnh / });
  const labels = () => nodes().map((node) => node.getAttribute("aria-label"));
  const activeSlot = () =>
    nodes().findIndex((node) => node.getAttribute("aria-current") === "true");
  expect(nodes()).toHaveLength(5);
  expect(activeSlot()).toBe(0);
  act(() => embla.api.scrollTo(1));
  expect(activeSlot()).toBe(1);
  act(() => embla.api.scrollTo(2));
  expect(activeSlot()).toBe(2);
  act(() => embla.api.scrollNext());
  expect(activeSlot()).toBe(2);
  expect(labels()).toEqual(["Xem ảnh 2", "Xem ảnh 3", "Xem ảnh 4", "Xem ảnh 5", "Xem ảnh 6"]);
  fireEvent.click(screen.getByRole("button", { name: "Xem ảnh 3" }));
  expect(activeSlot()).toBe(2);
  expect(labels()).toEqual(["Xem ảnh 1", "Xem ảnh 2", "Xem ảnh 3", "Xem ảnh 4", "Xem ảnh 5"]);
  act(() => embla.api.scrollTo(8));
  expect(activeSlot()).toBe(2);
  expect(nodes()).toHaveLength(5);
  act(() => embla.api.scrollNext());
  expect(activeSlot()).toBe(2);
  expect(labels()).toEqual(["Xem ảnh 8", "Xem ảnh 9", "Xem ảnh 1", "Xem ảnh 2", "Xem ảnh 3"]);
});
