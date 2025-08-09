import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SetupLayoutContent } from "../SetupLayoutContent";

describe("SetupLayoutContent", () => {
  const defaultProps = {
    title: "Test Title",
    description: "Test Description",
  };

  it("renders title and description correctly", () => {
    render(
      <SetupLayoutContent {...defaultProps}>
        <div data-testid="child-element">Test Child</div>
      </SetupLayoutContent>
    );

    // Check title and description
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("renders children correctly", () => {
    render(
      <SetupLayoutContent {...defaultProps}>
        <div data-testid="child-element">Test Child</div>
      </SetupLayoutContent>
    );

    // Check if children are rendered
    expect(screen.getByTestId("child-element")).toBeInTheDocument();
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("has proper layout classes", () => {
    const { container } = render(
      <SetupLayoutContent {...defaultProps}>
        <div>Test Child</div>
      </SetupLayoutContent>
    );

    // Check for layout classes
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass("max-w-4xl");
    expect(mainDiv).toHaveClass("flex");
    expect(mainDiv).toHaveClass("flex-1");

    // Title container has the right styles
    const titleContainer = container.querySelector("h1")?.parentElement;
    expect(titleContainer).toHaveClass("flex");
    expect(titleContainer).toHaveClass("flex-col");
    expect(titleContainer).toHaveClass("gap-2");

    // Content container exists
    expect(container.querySelector(".container")).toBeInTheDocument();
  });
});
