import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { Home } from "./Home";
import { render as customRender } from "../test/test-utils";
import { useRecordVisit } from "../hooks/useRecordVisit";

// Mock the hook
vi.mock("../hooks/useRecordVisit", () => ({
  useRecordVisit: vi.fn(),
}));

describe("Home Page", () => {
  it("should render all main sections", () => {
    customRender(<Home />);

    // Check all section IDs are present
    expect(document.getElementById("hero")).toBeInTheDocument();
    expect(document.getElementById("about")).toBeInTheDocument();
    expect(document.getElementById("expertise")).toBeInTheDocument();
    expect(document.getElementById("research")).toBeInTheDocument();
    expect(document.getElementById("projects")).toBeInTheDocument();
    expect(document.getElementById("skills")).toBeInTheDocument();
    expect(document.getElementById("contact")).toBeInTheDocument();
  });

  it("should render navbar and footer", () => {
    customRender(<Home />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(document.querySelector("footer")).toBeInTheDocument();
  });

  it("should call useRecordVisit hook", () => {
    customRender(<Home />);
    expect(useRecordVisit).toHaveBeenCalled();
  });

  it("should have proper page structure", () => {
    customRender(<Home />);

    const main = document.querySelector("main");
    expect(main).toBeInTheDocument();

    // Check background classes
    const container = document.querySelector(".min-h-screen.bg-background");
    expect(container).toBeInTheDocument();
  });

  it("renders home page structure", () => {
    customRender(<Home />);
    expect(document.getElementById("hero")).toBeInTheDocument();
  });
});
