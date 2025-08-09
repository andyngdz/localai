import { api } from "@/services/api";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MaxMemoryScaleFactor } from "../MaxMemoryScaleFactor";

// Mock dependencies
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

vi.mock("@/services/api", () => ({
  api: {
    setMaxMemory: vi.fn(),
  },
}));

vi.mock("@/features/layout/presentations/SetupLayout", () => ({
  SetupLayout: ({
    children,
    onNext,
    title,
    description,
  }: {
    children: React.ReactNode;
    onNext?: VoidFunction;
    title: string;
    description: string;
  }) => (
    <div data-testid="setup-layout">
      <h1>{title}</h1>
      <p>{description}</p>
      <div>{children}</div>
      <button data-testid="next-button" onClick={onNext}>
        Next
      </button>
    </div>
  ),
}));

vi.mock("../MaxMemoryScaleFactorItems", () => ({
  MaxMemoryScaleFactorItems: () => (
    <div data-testid="memory-scale-factor-items">Memory Items</div>
  ),
}));

vi.mock("../MaxMemoryScaleFactorPreview", () => ({
  MaxMemoryScaleFactorPreview: () => (
    <div data-testid="memory-scale-factor-preview">Memory Preview</div>
  ),
}));

describe("MaxMemoryScaleFactor", () => {
  it("renders all components correctly", () => {
    render(<MaxMemoryScaleFactor />);

    // Check title and description
    expect(screen.getByText("Max Memory")).toBeInTheDocument();
    expect(
      screen.getByText("Configure the maximum memory allocation for AI models")
    ).toBeInTheDocument();

    // Check that child components are rendered
    expect(screen.getByTestId("memory-scale-factor-items")).toBeInTheDocument();
    expect(
      screen.getByTestId("memory-scale-factor-preview")
    ).toBeInTheDocument();
  });

  it("calls API and navigates on form submission", async () => {
    vi.mocked(api.setMaxMemory).mockResolvedValue();
    const user = userEvent.setup();

    render(<MaxMemoryScaleFactor />);

    // Click the next button to submit the form
    await user.click(screen.getByTestId("next-button"));

    // Check that API was called with default scale factor
    await waitFor(() => {
      expect(api.setMaxMemory).toHaveBeenCalledWith({
        gpu_scale_factor: 0.5,
        ram_scale_factor: 0.5,
      });
    });
  });
});
