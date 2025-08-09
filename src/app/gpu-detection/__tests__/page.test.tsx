import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import GPUDetectionScreen from "../page";

// Mock the GpuDetection component
vi.mock("@/features/gpu-detection", () => ({
  GpuDetection: () => (
    <div data-testid="gpu-detection">GPU Detection Component</div>
  ),
}));

describe("GPUDetectionScreen", () => {
  it("renders GpuDetection component", () => {
    render(<GPUDetectionScreen />);

    expect(screen.getByTestId("gpu-detection")).toBeInTheDocument();
    expect(screen.getByText("GPU Detection Component")).toBeInTheDocument();
  });

  it("returns GpuDetection as default export", () => {
    const { container } = render(<GPUDetectionScreen />);

    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByTestId("gpu-detection")).toBeInTheDocument();
  });

  it("has correct component structure", () => {
    const { container } = render(<GPUDetectionScreen />);

    // Should render only the GpuDetection component
    expect(container.children).toHaveLength(1);
    expect(screen.getByTestId("gpu-detection")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(<GPUDetectionScreen />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
