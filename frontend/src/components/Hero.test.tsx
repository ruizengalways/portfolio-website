import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { HeroSection } from "./Hero";
import { render as customRender } from "../test/test-utils";

describe("HeroSection Component", () => {
  it("renders hero section with correct id and classes", () => {
    customRender(<HeroSection />);

    const heroSection = document.getElementById("hero");
    expect(heroSection).toBeInTheDocument();
    expect(heroSection).toHaveClass(
      "relative",
      "min-h-svh",
      "flex",
      "flex-col",
      "items-center",
      "px-4",
      "py-20",
    );
  });

  it("renders main heading with animated text spans", () => {
    customRender(<HeroSection />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass(
      "text-4xl",
      "md:text-6xl",
      "font-bold",
      "tracking-tight",
    );

    // Check individual spans
    const hiSpan = screen.getByText("Hi, I'm Dr");
    expect(hiSpan).toHaveClass("opacity-0", "animate-fade-in");

    const ruiSpan = screen.getByText("Rui");
    expect(ruiSpan).toHaveClass(
      "text-primary",
      "opacity-0",
      "animate-fade-in-delay-1",
    );

    const zengSpan = screen.getByText("Zeng");
    expect(zengSpan).toHaveClass(
      "text-gradient",
      "ml-2",
      "opacity-0",
      "animate-fade-in-delay-2",
    );
  });

  it("renders subtitle with PhD title", () => {
    customRender(<HeroSection />);

    const subtitle = screen.getByRole("heading", { level: 2 });
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveTextContent("PhD in Artificial Intelligence");
    expect(subtitle).toHaveClass(
      "text-2xl",
      "md:text-3xl",
      "font-semibold",
      "text-foreground",
      "tracking-tight",
    );
  });

  it("renders all professional titles", () => {
    customRender(<HeroSection />);

    const titles = [
      "Full Stack Developer",
      "Data Engineer",
      "Data Scientist",
      "AI Engineer",
      "System Designer",
    ];

    titles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    // Check separators
    expect(screen.getAllByText("•")).toHaveLength(4);
  });

  it("renders description paragraph", () => {
    customRender(<HeroSection />);

    const description = screen.getByText(
      /I design and deliver end-to-end intelligent systems/,
    );
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass(
      "text-lg",
      "md:text-xl",
      "text-muted-foreground",
      "max-w-2xl",
      "mx-auto",
      "opacity-0",
      "animate-fade-in-delay-3",
    );
  });

  it("renders call-to-action button with correct link", () => {
    customRender(<HeroSection />);

    const ctaButton = screen.getByRole("link", { name: /view my expertise/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute("href", "#expertise");
    expect(ctaButton).toHaveClass("cosmic-button");
  });

  it("renders scroll indicator with arrow", () => {
    customRender(<HeroSection />);

    const scrollText = screen.getByText("Scroll");
    expect(scrollText).toBeInTheDocument();
    expect(scrollText).toHaveClass("text-sm", "text-muted-foreground", "mb-2");

    // Check for arrow icon (it's an SVG, hard to test directly)
    const scrollContainer = scrollText.parentElement;
    expect(scrollContainer).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "animate-bounce",
    );

    // Check that there's an SVG element
    const arrow = document.querySelector(
      "svg.h-\\[1em\\].w-\\[1em\\].text-primary",
    );
    expect(arrow).toBeInTheDocument();
  });

  it("has proper semantic structure", () => {
    customRender(<HeroSection />);

    // Should have one h1 and one h2
    const headings = screen.getAllByRole("heading");
    expect(headings).toHaveLength(2);

    // Should have one link
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
  });

  it("applies responsive classes correctly", () => {
    customRender(<HeroSection />);

    const container = document.querySelector(".container");
    expect(container).toHaveClass(
      "max-w-4xl",
      "mx-auto",
      "flex",
      "flex-col",
      "gap-12",
      "md:gap-20",
      "2xl:gap-40",
      "text-center",
      "z-10",
      "my-auto",
    );
  });

  it("matches snapshot", () => {
    const { container } = customRender(<HeroSection />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
