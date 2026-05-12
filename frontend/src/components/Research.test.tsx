import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResearchSection } from "../components/Research";

describe("ResearchSection Component", () => {
  it("renders research section", () => {
    render(<ResearchSection />);

    const section = document.getElementById("research");
    expect(section).toBeInTheDocument();
  });

  it("renders research heading", () => {
    render(<ResearchSection />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain("Research & Innovation");
  });

  it("renders research stats", () => {
    render(<ResearchSection />);

    expect(screen.getByText("Citations")).toBeInTheDocument();
    expect(screen.getByText("Publications")).toBeInTheDocument();
    expect(screen.getByText("h-index")).toBeInTheDocument();
  });

  it("renders research themes", () => {
    render(<ResearchSection />);

    expect(screen.getByText("Large Language Models")).toBeInTheDocument();
    expect(screen.getByText("Natural Language Processing")).toBeInTheDocument();
    expect(screen.getByText("Computer Vision")).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(<ResearchSection />);

    expect(screen.getByText(/PhD-trained AI/)).toBeInTheDocument();
  });
});
