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

    // Should have two project cards
    const cards = document.querySelectorAll(".bg-card.rounded-lg");
    expect(cards).toHaveLength(2);
  });

  it("renders project images with correct attributes", () => {
    customRender(<ProjectsSection />);

    const portfolioImage = screen.getByAltText("Portfolio Website");
    expect(portfolioImage).toBeInTheDocument();
    expect(portfolioImage).toHaveAttribute(
      "src",
      "/projects/portfolio-website-project-cover.png",
    );

    const decisionOsImage = screen.getByAltText("DecisionOS");
    expect(decisionOsImage).toBeInTheDocument();
    expect(decisionOsImage).toHaveAttribute(
      "src",
      "/projects/decision-os-project-cover.png",
    );

    expect(portfolioImage).toHaveClass(
      "w-full",
      "h-full",
      "object-cover",
      "transition-transform",
      "duration-500",
      "group-hover:scale-110",
    );
    expect(decisionOsImage).toHaveClass(
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

    const tags = [
      "React",
      "TailwindCSS",
      "Cloudflare",
      "CI/CD",
      "LLM Systems",
      "Decision Intelligence",
      "Enterprise AI",
      "Governed AI",
    ];

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

    // Check that there are 8 tags
    const tagElements = document.querySelectorAll("span.px-2.py-1");
    expect(tagElements).toHaveLength(8);
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

    const decisionOsTitle = screen.getByRole("heading", { name: "DecisionOS" });
    expect(decisionOsTitle).toBeInTheDocument();

    const decisionOsDescription = screen.getByText(
      /An enterprise decision intelligence concept that shows how an LLM-based decision layer/,
    );
    expect(decisionOsDescription).toBeInTheDocument();
  });

  it("renders project links with correct attributes", () => {
    customRender(<ProjectsSection />);

    const portfolioDemoLink = screen.getByRole("link", {
      name: "Portfolio Website demo",
    });
    expect(portfolioDemoLink).toHaveAttribute("href", "https://ruizeng.dev");
    expect(portfolioDemoLink).toHaveAttribute("target", "_blank");

    const decisionOsDemoLink = screen.getByRole("link", {
      name: "DecisionOS demo",
    });
    expect(decisionOsDemoLink).toHaveAttribute(
      "href",
      "https://decision-os.ruizeng.dev/",
    );
    expect(decisionOsDemoLink).toHaveAttribute("target", "_blank");

    const decisionOsRepositoryLink = screen.getByRole("link", {
      name: "DecisionOS repository",
    });
    expect(decisionOsRepositoryLink).toBeInTheDocument();
    expect(decisionOsRepositoryLink).toHaveAttribute(
      "href",
      "https://ruizeng.dev",
    );
    expect(decisionOsRepositoryLink).toHaveAttribute("target", "_blank");
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

    // Should have h2 for main heading, h3 for project titles
    const headings = screen.getAllByRole("heading");
    expect(headings).toHaveLength(3);

    // Should have 5 links: 2 demo, 2 repo, 1 cta
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(5);
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
