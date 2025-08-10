import * as matchers from "@testing-library/jest-dom/matchers";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Editor } from "../Editor";

expect.extend(matchers);

// Mock the EditorNavbar component
vi.mock("../EditorNavbar", () => ({
  EditorNavbar: () => <div data-testid="mock-editor-navbar">Editor Navbar</div>,
}));

describe("Editor", () => {
  it("renders the EditorNavbar component", () => {
    render(<Editor />);

    expect(screen.getByTestId("mock-editor-navbar")).toBeInTheDocument();
  });

  it("renders with proper structure", () => {
    const { container } = render(<Editor />);

    // Check that there's a wrapping div
    const wrapperDiv = container.firstChild;
    expect(wrapperDiv).toBeInTheDocument();
    expect(wrapperDiv).toHaveTextContent("Editor Navbar");
  });
});
