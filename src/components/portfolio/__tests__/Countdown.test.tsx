import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Countdown } from "../Countdown";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

it("counts down to 10:30 Vietnam time and updates every second", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-22T03:29:58Z"));
  render(<Countdown />);
  expect(screen.getByLabelText("Đếm ngược đến lễ tốt nghiệp")).toHaveTextContent(
    "01 ngày00 giờ00 phút02 giây",
  );
  act(() => vi.advanceTimersByTime(2000));
  expect(screen.getByLabelText("Đếm ngược đến lễ tốt nghiệp")).toHaveTextContent(
    "01 ngày00 giờ00 phút00 giây",
  );
  cleanup();
  expect(vi.getTimerCount()).toBe(0);
});

it("stops at zero after the ceremony starts", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-23T03:30:01Z"));
  render(<Countdown />);
  expect(screen.getByText("Đã đến ngày tốt nghiệp!")).toBeInTheDocument();
  expect(screen.getByLabelText("Đếm ngược đến lễ tốt nghiệp")).not.toHaveTextContent("-");
});
