import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { AboutSection } from "./About";
import { render as customRender } from "../test/test-utils";

describe("AboutSection Component", () => {
  it("renders about section with correct structure", () => {
    customRender(<AboutSection />);

    const section = document.getElementById("about");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass(
      "relative",
      "min-h-screen",
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
    );
  });

  it("renders main heading with correct text and styling", () => {
    customRender(<AboutSection />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("About Me");
    expect(heading).toHaveClass(
      "container",
      "text-3xl",
      "md:text-5xl",
      "font-bold",
      "mb-12",
    );
  });

  it("renders subtitle with animation", () => {
    customRender(<AboutSection />);

    const subtitle = screen.getByRole("heading", { level: 3 });
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveTextContent(
      "Designing Scalable Data & AI Systems That Deliver Real Impact",
    );
    expect(subtitle).toHaveClass(
      "text-3xl",
      "md:text-4xl",
      "font-semibold",
      "animate-fade-in-delay-1",
    );
  });

  it("renders all bio paragraphs with correct content", () => {
    customRender(<AboutSection />);

    const paragraphs = screen.getAllByText(/./, { selector: "p" });
    expect(paragraphs).toHaveLength(3);

    // Check key phrases in each paragraph
    expect(screen.getByText(/Principal Data Engineer/)).toBeInTheDocument();
    expect(screen.getByText(/production-grade platforms/)).toBeInTheDocument();
    expect(screen.getByText(/Full-Stack Development/)).toBeInTheDocument();

    // Check that paragraphs have correct classes
    paragraphs.forEach((p) => {
      expect(p).toHaveClass(
        "text-lg",
        "text-muted-foreground",
        "max-w-3xl",
        "mx-auto",
      );
    });
  });

  it("renders all highlight tags with correct styling", () => {
    customRender(<AboutSection />);

    const highlights = [
      "Data Engineering",
      "Data Science",
      "Machine Learning",
      "Data Analysis",
      "Data Governance",
      "MLOps",
      "DataOps",
      "Cloud Architecture",
      "System Design",
      "LLM Applications",
      "AI Applications",
    ];

    highlights.forEach((highlight) => {
      const element = screen.getByText(highlight);
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass(
        "px-4",
        "py-2",
        "rounded-full",
        "border",
        "border-primary/50",
        "bg-primary/5",
        "hover:shadow-[0_0_15px_rgba(117,0,20,0.5)]",
        "hover:bg-primary/10",
        "hover:border-primary",
        "text-sm",
        "text-primary",
        "font-medium",
        "transition-all",
        "duration-300",
        "animate-float",
        "cursor-default",
      );
    });

    // Check that there are 11 highlight spans
    const highlightElements = document.querySelectorAll(
      "span.px-4.py-2.rounded-full",
    );
    expect(highlightElements).toHaveLength(11);
  });

  it("renders call-to-action button with correct link", () => {
    customRender(<AboutSection />);

    const ctaButton = screen.getByRole("link", { name: /get in touch/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute("href", "#contact");
    expect(ctaButton).toHaveClass("cosmic-button");
  });

  it("has proper semantic structure", () => {
    customRender(<AboutSection />);

    // Should have h2, h3, and paragraphs
    const headings = screen.getAllByRole("heading");
    expect(headings).toHaveLength(2); // h2 and h3

    // Should have one link
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
  });

  it("applies responsive classes", () => {
    customRender(<AboutSection />);

    const container = document.querySelector(".container");
    expect(container).toHaveClass("mx-auto", "max-w-4xl", "text-center");

    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toHaveClass("text-3xl", "md:text-5xl");
  });

  it("renders highlights in flex wrap layout", () => {
    customRender(<AboutSection />);

    const highlightsContainer = document.querySelector(
      ".flex.flex-wrap.justify-center.gap-3",
    );
    expect(highlightsContainer).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = customRender(<AboutSection />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
