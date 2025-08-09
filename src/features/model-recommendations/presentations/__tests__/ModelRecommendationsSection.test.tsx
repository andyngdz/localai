import { ModelRecommendationItem, ModelRecommendationSection } from "@/types/api";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ModelRecommendationsSection } from "../ModelRecommendationsSection";

// Mock the child components
vi.mock("../ModelRecommendationsHeader", () => ({
  ModelRecommendationsHeader: ({
    title,
    description,
    isRecommended,
  }: {
    title: string;
    description: string;
    isRecommended: boolean;
  }) => (
    <div
      data-testid="mock-header"
      data-title={title}
      data-description={description}
      data-is-recommended={isRecommended.toString()}
    >
      {title}
    </div>
  ),
}));

vi.mock("../ModelRecommendationsCard", () => ({
  ModelRecommendationsCard: ({ model }: { model: ModelRecommendationItem }) => (
    <div data-testid="mock-card" data-model-id={model.id} data-model-name={model.name}>
      {model.name}
    </div>
  ),
}));

describe("ModelRecommendationsSection", () => {
  // Create mock data for testing
  const mockModel1: ModelRecommendationItem = {
    id: "model1",
    name: "Model 1",
    description: "Description 1",
    memory_requirement_gb: 8,
    model_size: "7B",
    tags: ["tag1", "tag2"],
    is_recommended: false,
  };

  const mockModel2: ModelRecommendationItem = {
    id: "model2",
    name: "Model 2",
    description: "Description 2",
    memory_requirement_gb: 16,
    model_size: "13B",
    tags: ["tag3", "tag4"],
    is_recommended: true,
  };

  const mockSection: ModelRecommendationSection = {
    id: "section1",
    name: "Test Section",
    description: "Test Section Description",
    models: [mockModel1, mockModel2],
    is_recommended: false,
  };

  it("renders section with correct structure", () => {
    const { container } = render(
      <ModelRecommendationsSection section={mockSection} isDefaultRecommended={false} />
    );

    // Check the main container has the expected classes
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass("flex");
    expect(mainDiv).toHaveClass("flex-col");
    expect(mainDiv).toHaveClass("gap-4");
  });

  it("passes correct props to ModelRecommendationsHeader", () => {
    render(<ModelRecommendationsSection section={mockSection} isDefaultRecommended={false} />);

    const header = screen.getByTestId("mock-header");
    expect(header).toBeInTheDocument();
    expect(header).toHaveAttribute("data-title", "Test Section");
    expect(header).toHaveAttribute("data-description", "Test Section Description");
    expect(header).toHaveAttribute("data-is-recommended", "false");
  });

  it("renders header with isRecommended=true when section is recommended", () => {
    const recommendedSection = {
      ...mockSection,
      is_recommended: true,
    };

    render(
      <ModelRecommendationsSection section={recommendedSection} isDefaultRecommended={false} />
    );

    const header = screen.getByTestId("mock-header");
    expect(header).toHaveAttribute("data-is-recommended", "true");
  });

  it("renders header with isRecommended=true when isDefaultRecommended is true", () => {
    render(<ModelRecommendationsSection section={mockSection} isDefaultRecommended={true} />);

    const header = screen.getByTestId("mock-header");
    expect(header).toHaveAttribute("data-is-recommended", "true");
  });

  it("renders all model cards in the section", () => {
    render(<ModelRecommendationsSection section={mockSection} isDefaultRecommended={false} />);

    const cards = screen.getAllByTestId("mock-card");
    expect(cards).toHaveLength(2);

    // Check that the model data is passed correctly to each card
    expect(cards[0]).toHaveAttribute("data-model-id", "model1");
    expect(cards[0]).toHaveAttribute("data-model-name", "Model 1");
    expect(cards[1]).toHaveAttribute("data-model-id", "model2");
    expect(cards[1]).toHaveAttribute("data-model-name", "Model 2");
  });

  it("renders no cards when section has no models", () => {
    const emptySection = {
      ...mockSection,
      models: [],
    };

    render(<ModelRecommendationsSection section={emptySection} isDefaultRecommended={false} />);

    const cards = screen.queryAllByTestId("mock-card");
    expect(cards).toHaveLength(0);
  });
});
