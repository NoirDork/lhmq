import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionTitle } from "../SectionTitle";

describe("SectionTitle", () => {
  it("renders title", () => {
    render(<SectionTitle title="Hello" />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders eyebrow when provided", () => {
    render(<SectionTitle eyebrow="Eyebrow" title="Title" />);
    expect(screen.getByText("— Eyebrow")).toBeInTheDocument();
  });

  it("applies center alignment class", () => {
    const { container } = render(<SectionTitle title="Title" align="center" />);
    expect(container.firstChild).toHaveClass("text-center");
  });
});
