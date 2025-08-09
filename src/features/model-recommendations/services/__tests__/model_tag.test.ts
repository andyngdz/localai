import { describe, expect, it } from "vitest";
import { modelTagService } from "../model_tag";

// The variants are ["success", "warning", "default"]
describe("ModelTagService", () => {
  it("returns the correct color for each index", () => {
    expect(modelTagService.getChipColor(0)).toBe("success");
    expect(modelTagService.getChipColor(1)).toBe("warning");
    expect(modelTagService.getChipColor(2)).toBe("default");
  });

  it("cycles through the variants for higher indices", () => {
    expect(modelTagService.getChipColor(3)).toBe("success");
    expect(modelTagService.getChipColor(4)).toBe("warning");
    expect(modelTagService.getChipColor(5)).toBe("default");
    expect(modelTagService.getChipColor(6)).toBe("success");
  });
});
