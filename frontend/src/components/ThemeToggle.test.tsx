import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "../components/ThemeToggle";

describe("ThemeToggle Component", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset document classes
    document.documentElement.classList.remove("dark");
  });

  it("renders toggle button", () => {
    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });

  it("toggles dark mode class on click", () => {
    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: /toggle theme/i });

    // Initially light mode
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    // Click to enable dark mode
    fireEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    // Click to disable dark mode
    fireEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("persists theme preference to localStorage", () => {
    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: /toggle theme/i });

    // Enable dark mode
    fireEvent.click(button);
    expect(localStorage.getItem("theme")).toBe("dark");

    // Disable dark mode
    fireEvent.click(button);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("reads theme preference from localStorage on mount", () => {
    // Set dark mode in localStorage
    localStorage.setItem("theme", "dark");

    render(<ThemeToggle />);

    // Component should apply dark mode from localStorage
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
