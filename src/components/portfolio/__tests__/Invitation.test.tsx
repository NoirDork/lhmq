import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Invitation } from "../Invitation";

describe("Invitation", () => {
  it("provides an accessible graduation portrait with a usable image source", () => {
    render(<Invitation />);
    const portrait = screen.getByRole("img", { name: /Lâm Hồng Minh Quân/ });
    expect(portrait.getAttribute("src")).toBeTruthy();
  });

  it("keeps academic details available below the invitation", () => {
    render(<Invitation />);
    expect(screen.getByText("Tài chính – Ngân hàng")).toBeInTheDocument();
    expect(screen.getByText("K22404")).toBeInTheDocument();
    expect(screen.getByText("K224040541")).toBeInTheDocument();
  });
});
