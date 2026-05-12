import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExpertiseSection } from "../components/Expertise";

describe("ExpertiseSection Component", () => {
  it("renders expertise section", () => {
    render(<ExpertiseSection />);

    const section = document.getElementById("expertise");
    expect(section).toBeInTheDocument();
  });

  it("renders expertise heading", () => {
    render(<ExpertiseSection />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain("What I Do");
  });

  it("renders expertise areas", () => {
    render(<ExpertiseSection />);

    expect(
      screen.getByText("Data Engineering & Platforms"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Cloud Architecture & Infrastructure"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Machine Learning & AI Systems"),
    ).toBeInTheDocument();
  });

  it("renders skill lists", () => {
    render(<ExpertiseSection />);

    // Check for some specific skills
    expect(screen.getByText(/Medallion architecture/)).toBeInTheDocument();
    expect(screen.getByText(/AWS ecosystem/)).toBeInTheDocument();
    expect(screen.getByText(/LLMs, NLP/)).toBeInTheDocument();
  });
});
