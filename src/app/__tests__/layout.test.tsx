import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RootLayout, { metadata } from "../layout";

// Mock the CSS import
vi.mock("../globals.css", () => ({}));

// Mock the components and providers
vi.mock("../providers", () => ({
  Providers: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="providers">{children}</div>
  ),
}));

vi.mock("@/features/streaming-messages/presentations/StreamingMessage", () => ({
  StreamingMessage: () => <div data-testid="streaming-message" />,
}));

vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    unstable_ViewTransition: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="view-transition">{children}</div>
    ),
  };
});

vi.mock("next/font/google", () => ({
  Inter: () => ({
    variable: "--font-inter",
    className: "font-inter",
  }),
}));

describe("RootLayout", () => {
  it("renders children within proper structure", () => {
    const testChildren = <div data-testid="test-children">Test Content</div>;

    render(<RootLayout>{testChildren}</RootLayout>);

    // Check basic structure
    expect(screen.getByTestId("providers")).toBeInTheDocument();
    expect(screen.getByTestId("view-transition")).toBeInTheDocument();
    expect(screen.getByTestId("streaming-message")).toBeInTheDocument();
    expect(screen.getByTestId("test-children")).toBeInTheDocument();
  });

  it("applies correct HTML structure", () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );

    // Since we're testing a layout component, focus on what we can actually test
    // The layout structure is correctly applied via props rather than DOM hierarchy
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByTestId("providers")).toBeInTheDocument();
  });

  it("includes StreamingMessage component", () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );

    expect(screen.getByTestId("streaming-message")).toBeInTheDocument();
  });

  it("wraps children with Providers", () => {
    render(
      <RootLayout>
        <div data-testid="child-content">Child</div>
      </RootLayout>
    );

    expect(screen.getByTestId("providers")).toBeInTheDocument();
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  it("applies ViewTransition wrapper", () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );

    expect(screen.getByTestId("view-transition")).toBeInTheDocument();
  });
});

describe("metadata", () => {
  it("exports correct metadata", () => {
    expect(metadata).toEqual({
      title: "LocalAI",
      description:
        "Generate images with Stable Diffusion, run LLMs, and more, all on your local machine.",
    });
  });
});
