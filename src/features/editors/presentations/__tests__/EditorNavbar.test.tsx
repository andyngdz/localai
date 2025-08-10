import { mockNextImage } from "@/cores/test-utils";
import * as matchers from "@testing-library/jest-dom/matchers";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EditorNavbar } from "../EditorNavbar";

expect.extend(matchers);

// Mock the NextImage component
vi.mock("next/image", () => mockNextImage());

// Mock the ModelSelector component
vi.mock("@/features/model-selectors/presentations/ModelSelector", () => ({
  ModelSelector: () => <div data-testid="mock-model-selector">Model Selector</div>,
}));

// Mock the HeroUI components
vi.mock("@heroui/react", () => ({
  Navbar: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <nav className={className} data-testid="mock-navbar">
      {children}
    </nav>
  ),
  NavbarBrand: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-navbar-brand">{children}</div>
  ),
  NavbarContent: ({ children, justify }: { children: React.ReactNode; justify?: string }) => (
    <div data-testid={`mock-navbar-content-${justify}`}>{children}</div>
  ),
  NavbarItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-navbar-item">{children}</div>
  ),
}));

describe("EditorNavbar", () => {
  it("renders the navbar with logo", () => {
    render(<EditorNavbar />);

    expect(screen.getByTestId("mock-navbar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-navbar-brand")).toBeInTheDocument();
    expect(screen.getByTestId("mock-next-image")).toBeInTheDocument();
    expect(screen.getByTestId("mock-next-image")).toHaveAttribute("data-alt", "LocalAI Logo");
  });

  it("renders the model selector in the center content", () => {
    render(<EditorNavbar />);

    expect(screen.getByTestId("mock-navbar-content-center")).toBeInTheDocument();
    expect(screen.getByTestId("mock-navbar-item")).toBeInTheDocument();
    expect(screen.getByTestId("mock-model-selector")).toBeInTheDocument();
  });

  it("renders end navbar content", () => {
    render(<EditorNavbar />);

    expect(screen.getByTestId("mock-navbar-content-end")).toBeInTheDocument();
  });

  it("applies the correct className to the navbar", () => {
    render(<EditorNavbar />);

    const navbar = screen.getByTestId("mock-navbar");
    expect(navbar).toHaveClass("bg-content1");
  });
});
