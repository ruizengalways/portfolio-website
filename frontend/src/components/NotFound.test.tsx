import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotFound } from "../components/NotFound";

describe("NotFound Component", () => {
  it("renders 404 heading", () => {
    render(<NotFound />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain("404");
  });

  it("renders not found message", () => {
    render(<NotFound />);

    expect(screen.getByText("404 - Page Not Found")).toBeInTheDocument();
    expect(screen.getByText(/does not exist/)).toBeInTheDocument();
  });
});
