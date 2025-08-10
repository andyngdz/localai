import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GeneratorConfigExtra } from "../GeneratorConfigExtra";

describe("GeneratorConfigExtra", () => {
  it("should render the component with the correct header", () => {
    render(<GeneratorConfigExtra />);

    // Check that the header text is displayed
    expect(screen.getByText("Extra")).toBeInTheDocument();
  });

  it("should render the add button with correct aria-label", () => {
    render(<GeneratorConfigExtra />);

    // Check that the button with aria-label is present
    expect(screen.getByRole("button", { name: "Add Extra" })).toBeInTheDocument();
  });

  it("should render the Plus icon in the button", () => {
    const { container } = render(<GeneratorConfigExtra />);

    // Since the Plus is an SVG icon from lucide-react, we can check for SVG element
    // The lucide icon has specific classes
    const iconElement = container.querySelector("svg");
    expect(iconElement).toBeInTheDocument();
  });

  it("should render the button as iconOnly", () => {
    render(<GeneratorConfigExtra />);

    const button = screen.getByRole("button", { name: "Add Extra" });
    // IconOnly buttons typically have a specific styling or class
    // Here we can check that the button doesn't have visible text content
    expect(button).not.toHaveTextContent(/\S/); // No visible text in the button
  });
});
