import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SetupLayoutBackground } from "../SetupLayoutBackground";

describe("SetupLayoutBackground", () => {
  it("renders with correct background image and styling", () => {
    const { container } = render(<SetupLayoutBackground />);
    
    // Check if the background div exists
    const backgroundDiv = container.firstChild as HTMLElement;
    expect(backgroundDiv).toBeInTheDocument();
    
    // Check if it has the correct classes
    expect(backgroundDiv).toHaveClass("absolute");
    expect(backgroundDiv).toHaveClass("inset-0");
    expect(backgroundDiv).toHaveClass("-z-10");
    expect(backgroundDiv).toHaveClass("bg-background/70");
    expect(backgroundDiv).toHaveClass("bg-blend-overlay");
    expect(backgroundDiv).toHaveClass("bg-cover");
    expect(backgroundDiv).toHaveClass("bg-center");
    
    // Check if it has the background image style
    expect(backgroundDiv.style.backgroundImage).toContain("url");
  });
});
