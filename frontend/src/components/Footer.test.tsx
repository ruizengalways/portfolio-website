import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "../components/Footer";

// Mock the API services
vi.mock("../services/api", () => ({
  checkHealth: vi.fn(() =>
    Promise.resolve({ timestamp: new Date().toISOString() }),
  ),
  getVisitorStats: vi.fn(() =>
    Promise.resolve({ totalVisits: 100, todayVisits: 5 }),
  ),
}));

describe("Footer Component", () => {
  it("renders footer", () => {
    render(<Footer />);

    expect(screen.getByText(/© \d{4}/)).toBeInTheDocument(); // Copyright year
  });

  it("displays current year", () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });
});
