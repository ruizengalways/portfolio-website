import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navbar } from "./Navbar";
import { render as customRender } from "../test/test-utils";

// Mock window.scrollY and scroll event
const mockScrollY = vi.fn();
Object.defineProperty(window, "scrollY", {
  get: mockScrollY,
  configurable: true,
});

const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

Object.defineProperty(window, "addEventListener", {
  value: mockAddEventListener,
  writable: true,
});

Object.defineProperty(window, "removeEventListener", {
  value: mockRemoveEventListener,
  writable: true,
});

describe("Navbar Component", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    mockScrollY.mockReturnValue(0);
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.style.overflow = "unset";
  });

  it("renders navbar with correct structure", () => {
    customRender(<Navbar />);

    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass("fixed", "top-0", "left-0", "w-full", "z-40");
  });

  it("renders brand link with correct text", () => {
    customRender(<Navbar />);

    const brandLink = screen.getByRole("link", { name: /rui zeng portfolio/i });
    expect(brandLink).toBeInTheDocument();
    expect(brandLink).toHaveAttribute("href", "#hero");
  });

  it("renders all navigation links on desktop", () => {
    customRender(<Navbar />);

    const navItems = [
      "Home",
      "About",
      "Expertise",
      "Projects",
      "Research",
      "Skills",
      "Contact",
    ];
    const desktopContainer = screen.getAllByText("Home")[0].closest("div");
    navItems.forEach((item) => {
      const link = within(desktopContainer!).getByRole("link", { name: item });
      expect(link).toBeInTheDocument();
    });
  });

  it("renders theme toggle on desktop", () => {
    customRender(<Navbar />);
    const themeToggle = screen.getAllByRole("button", {
      name: /toggle theme/i,
    });
    expect(themeToggle.length).toBeGreaterThan(0);
    expect(themeToggle[0]).toBeInTheDocument();
  });

  it("renders mobile menu button", () => {
    customRender(<Navbar />);

    const menuButton = screen.getByRole("button", { name: /open menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  it("closes mobile menu when clicking a navigation link", async () => {
    customRender(<Navbar />);

    const menuButton = screen.getByRole("button", { name: /open menu/i });
    await user.click(menuButton);

    // Menu should be open
    expect(document.body.style.overflow).toBe("hidden");

    // Click a link in mobile menu
    const homeLink = screen.getAllByRole("link", { name: "Home" })[1]; // Mobile version
    await user.click(homeLink);

    // Menu should close
    expect(document.body.style.overflow).toBe("unset");
  });

  it("applies default styles when not scrolled", () => {
    mockScrollY.mockReturnValue(5);

    customRender(<Navbar />);

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("py-5");
    expect(nav).not.toHaveClass("bg-background/50");
  });

  it("adds and removes scroll event listener", () => {
    const { unmount } = customRender(<Navbar />);

    expect(mockAddEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );
  });

  it("hides desktop navigation on mobile screens", () => {
    // This is hard to test in jsdom, but we can check classes
    customRender(<Navbar />);

    const desktopNav = document.querySelector(".hidden.md\\:flex");
    expect(desktopNav).toBeInTheDocument();
  });

  it("shows mobile menu on small screens", () => {
    customRender(<Navbar />);

    const mobileMenu = document.querySelector(".md\\:hidden");
    expect(mobileMenu).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = customRender(<Navbar />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
