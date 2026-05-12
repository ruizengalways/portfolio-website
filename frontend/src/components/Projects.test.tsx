import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { ProjectsSection } from "./Projects";
import { render as customRender } from "../test/test-utils";

describe("ProjectsSection Component", () => {
  it("renders projects section with correct structure", () => {
    customRender(<ProjectsSection />);

    const section = document.getElementById("projects");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("min-h-screen", "py-24", "px-4", "relative");
  });

  it("renders main heading and description", () => {
    customRender(<ProjectsSection />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Featured Projects");

    const description = screen.getByText(
      /Showcasing robust architectures built with a 'zero-to-one' mindset/,
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

  it("renders project cards in grid layout", () => {
    customRender(<ProjectsSection />);

    const grid = document.querySelector(
      ".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3",
    );
    expect(grid).toBeInTheDocument();

    // Should have one project card
    const cards = document.querySelectorAll(".bg-card.rounded-lg");
    expect(cards).toHaveLength(1);
  });

  it("renders project image with correct attributes", () => {
    customRender(<ProjectsSection />);

    const image = document.querySelector("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      "/projects/portfolio-website-project-cover.png",
    );
    expect(image).toHaveAttribute("alt", "Portfolio Website");
    expect(image).toHaveClass(
      "w-full",
      "h-full",
      "object-cover",
      "transition-transform",
      "duration-500",
      "group-hover:scale-110",
    );
  });

  it("renders project tags correctly", () => {
    customRender(<ProjectsSection />);

    const tags = ["React", "TailwindCSS", "Cloudflare", "CI/CD"];

    tags.forEach((tag) => {
      const tagElement = screen.getByText(tag);
      expect(tagElement).toBeInTheDocument();
      expect(tagElement).toHaveClass(
        "px-2",
        "py-1",
        "text-xs",
        "font-medium",
        "border",
        "rounded-full",
        "bg-secondary",
        "text-secondary-foreground",
      );
    });

    // Check that there are 4 tags
    const tagElements = document.querySelectorAll("span.px-2.py-1");
    expect(tagElements).toHaveLength(4);
  });

  it("renders project title and description", () => {
    customRender(<ProjectsSection />);

    const title = screen.getByRole("heading", { name: "Portfolio Website" });
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("text-xl", "font-semibold", "mb-1");

    const description = screen.getByText(
      /A high-performance personal infrastructure project/,
    );
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass("text-muted-foreground", "text-sm", "mb-4");
  });

  it("renders project links with correct attributes", () => {
    customRender(<ProjectsSection />);

    const githubLink = screen.getByRole("link", { name: /github/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/ruizengalways",
    );
    expect(githubLink).toHaveAttribute("target", "_blank");
  });

  it("renders GitHub CTA button", () => {
    customRender(<ProjectsSection />);

    const ctaButton = screen.getByRole("link", { name: /check my github/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute(
      "href",
      "https://github.com/ruizengalways",
    );
    expect(ctaButton).toHaveAttribute("target", "_blank");
    expect(ctaButton).toHaveClass(
      "cosmic-button",
      "w-fit",
      "flex",
      "items-center",
      "mx-auto",
      "gap-2",
    );
  });

  it("has proper semantic structure", () => {
    customRender(<ProjectsSection />);

    // Should have h2 for main heading, h3 for project title
    const headings = screen.getAllByRole("heading");
    expect(headings).toHaveLength(2);

    // Should have 3 links: demo, github, cta
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
  });

  it("applies hover effects and transitions", () => {
    customRender(<ProjectsSection />);

    const card = document.querySelector(".card-hover");
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass(
      "group",
      "bg-card",
      "rounded-lg",
      "overflow-hidden",
      "shadow-xs",
      "card-hover",
    );
  });

  it("matches snapshot", () => {
    const { container } = customRender(<ProjectsSection />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
