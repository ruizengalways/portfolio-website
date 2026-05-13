import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkillsSection } from "./Skills";

describe("SkillsSection Component", () => {
  it("renders skills section with correct id", () => {
    render(<SkillsSection />);

    const section = document.getElementById("skills");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass(
      "py-24",
      "px-4",
      "relative",
      "min-h-screen",
      "snap-start",
    );
  });

  it("renders the main heading with correct text and styling", () => {
    render(<SkillsSection />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("How I Build Systems");
    expect(heading).toHaveClass(
      "container",
      "text-3xl",
      "md:text-5xl",
      "font-bold",
      "mb-12",
    );
  });

  it("renders the description paragraph", () => {
    render(<SkillsSection />);

    const description = screen.getByText(
      /The core technologies and frameworks I use to solve complex problems and build modern infrastructure./,
    );
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass(
      "text-center",
      "text-muted-foreground",
      "mb-12",
      "max-w-2xl",
      "mx-auto",
    );
  });

  it("renders all skill sections", () => {
    render(<SkillsSection />);

    const sectionTitles = [
      "Core Languages",
      "Data Platforms",
      "Databases & Warehouses",
      "Cloud & Infrastructure",
      "System & AI",
      "Platform Engineering & DevOps",
    ];

    sectionTitles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it("renders icons for each section", () => {
    render(<SkillsSection />);

    // Check that icons are present (they have specific classes from lucide-react)
    const icons = document.querySelectorAll("svg.h-5.w-5.text-primary");
    expect(icons).toHaveLength(6); // One for each section
  });

  it("renders all skills as clickable spans with correct styling", () => {
    render(<SkillsSection />);

    // Get all skill spans
    const skillSpans = document.querySelectorAll(
      "span.px-4.py-2.rounded-full.border",
    );
    expect(skillSpans.length).toBeGreaterThan(50); // Should have many skills

    // Check a few specific skills
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Kafka")).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
    expect(screen.getByText("Docker")).toBeInTheDocument();
  });

  it("renders skills in responsive columns", () => {
    render(<SkillsSection />);

    const skillsContainer = document.querySelector(
      "div.columns-1.md\\:columns-2",
    );
    expect(skillsContainer).toBeInTheDocument();
    expect(skillsContainer).toHaveClass(
      "columns-1",
      "md:columns-2",
      "gap-10",
      "[column-fill:balance]",
      "text-left",
      "space-y-10",
    );
  });

  it("ensures skills are accessible with proper semantic structure", () => {
    render(<SkillsSection />);

    // Check that section has proper heading hierarchy
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(1); // Main heading + section headings

    // Check that skills are in spans (though spans aren't ideal for accessibility, but for skills tags it's common)
    const skills = document.querySelectorAll("span");
    expect(skills.length).toBeGreaterThan(0);
  });
});
