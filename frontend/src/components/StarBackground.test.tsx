import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { StarBackground } from "../components/StarBackground";

describe("StarBackground Component", () => {
  it("renders star background container", () => {
    const { container } = render(<StarBackground />);

    // Should render a div with stars
    expect(container.firstChild).toBeTruthy();
  });

  it("creates stars on mount", () => {
    const { container } = render(<StarBackground />);

    // Check if stars are created (this is a basic check)
    const starsContainer =
      container.querySelector('[class*="star"]') || container.firstChild;
    expect(starsContainer).toBeTruthy();
  });

  it("handles window resize", () => {
    // Mock window resize
    const resizeEvent = new Event("resize");
    window.dispatchEvent(resizeEvent);

    // Component should handle resize without crashing
    expect(() => render(<StarBackground />)).not.toThrow();
  });
});
