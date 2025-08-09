import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ModelRecommendationsPage from "../page";

// Mock the ModelRecommendations component
vi.mock("@/features/model-recommendations", () => ({
  ModelRecommendations: () => (
    <div data-testid="model-recommendations">Model Recommendations Component</div>
  ),
}));

describe("ModelRecommendationsPage", () => {
  it("renders ModelRecommendations component", () => {
    render(<ModelRecommendationsPage />);

    expect(screen.getByTestId("model-recommendations")).toBeInTheDocument();
    expect(screen.getByText("Model Recommendations Component")).toBeInTheDocument();
  });

  it("returns ModelRecommendations as default export", () => {
    const { container } = render(<ModelRecommendationsPage />);

    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByTestId("model-recommendations")).toBeInTheDocument();
  });

  it("has correct component structure", () => {
    const { container } = render(<ModelRecommendationsPage />);

    // Should render only the ModelRecommendations component
    expect(container.children).toHaveLength(1);
    expect(screen.getByTestId("model-recommendations")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(<ModelRecommendationsPage />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
