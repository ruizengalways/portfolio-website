import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { NotFound } from "./NotFound";
import { render as customRender } from "../test/test-utils";

describe("NotFound Page", () => {
  it("should render 404 message", () => {
    customRender(<NotFound />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "404 - Page Not Found",
    );
    expect(
      screen.getByText("The page you are looking for does not exist."),
    ).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = customRender(<NotFound />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
