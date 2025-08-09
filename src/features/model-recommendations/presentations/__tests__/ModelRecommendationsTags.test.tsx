import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { modelTagService } from "../../services/model_tag";
import { ModelRecommendationsTags } from "../ModelRecommendationsTags";

describe("ModelRecommendationsTags", () => {
  const tags = ["tag1", "tag2", "tag3"];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(modelTagService, "getChipColor").mockImplementation(
      (i) => (["success", "warning", "default"] as const)[i]
    );
  });

  it("renders a Chip for each tag with correct color and text", () => {
    render(<ModelRecommendationsTags tags={tags} />);

    tags.forEach((tag, i) => {
      const chip = screen.getByText(tag);

      expect(chip).toBeInTheDocument();
      expect(modelTagService.getChipColor).toHaveBeenCalledWith(i);
    });
    expect(modelTagService.getChipColor).toHaveBeenCalledTimes(tags.length);
  });

  it("renders nothing if tags is empty", () => {
    render(<ModelRecommendationsTags tags={[]} />);
    expect(screen.queryByText(/./)).toBeNull();
  });
});
