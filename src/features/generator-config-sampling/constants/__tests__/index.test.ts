import { describe, expect, it } from "vitest";
import { COMMON_STEPS } from "../index";

describe("Generator Config Sampling Constants", () => {
  describe("COMMON_STEPS", () => {
    it("should contain the expected step values", () => {
      expect(COMMON_STEPS).toEqual([16, 24, 32]);
    });

    it("should have values in ascending order", () => {
      const sortedSteps = [...COMMON_STEPS].sort((a, b) => a - b);
      expect(COMMON_STEPS).toEqual(sortedSteps);
    });

    it("should contain only positive integers", () => {
      COMMON_STEPS.forEach((step) => {
        expect(Number.isInteger(step)).toBe(true);
        expect(step).toBeGreaterThan(0);
      });
    });

    it("should not contain duplicate values", () => {
      const uniqueSteps = [...new Set(COMMON_STEPS)];
      expect(COMMON_STEPS.length).toEqual(uniqueSteps.length);
    });
  });
});
