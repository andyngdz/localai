import { describe, expect, it } from "vitest";
import { maxMemoryScaleFactorService } from "../max-memory-scale-factor";

describe("MaxMemoryScaleFactorService", () => {
  describe("memoryColor", () => {
    it("returns success color classes for scale factor <= 0.5", () => {
      const result = maxMemoryScaleFactorService.memoryColor(0.5);
      expect(result.bgClassName).toBe("bg-success/10");
      expect(result.textClassName).toBe("text-success/90");
      expect(result.color).toBe("success");
    });

    it("returns success color classes for scale factor < 0.5", () => {
      const result = maxMemoryScaleFactorService.memoryColor(0.3);
      expect(result.bgClassName).toBe("bg-success/10");
      expect(result.textClassName).toBe("text-success/90");
      expect(result.color).toBe("success");
    });

    it("returns warning color classes for scale factor > 0.5 and <= 0.7", () => {
      const result = maxMemoryScaleFactorService.memoryColor(0.6);
      expect(result.bgClassName).toBe("bg-warning/10");
      expect(result.textClassName).toBe("text-warning/90");
      expect(result.color).toBe("warning");
    });

    it("returns warning color classes for scale factor = 0.7", () => {
      const result = maxMemoryScaleFactorService.memoryColor(0.7);
      expect(result.bgClassName).toBe("bg-warning/10");
      expect(result.textClassName).toBe("text-warning/90");
      expect(result.color).toBe("warning");
    });

    it("returns danger color classes for scale factor > 0.7", () => {
      const result = maxMemoryScaleFactorService.memoryColor(0.8);
      expect(result.bgClassName).toBe("bg-danger/10");
      expect(result.textClassName).toBe("text-danger/90");
      expect(result.color).toBe("danger");
    });

    it("returns danger color classes for scale factor = 1", () => {
      const result = maxMemoryScaleFactorService.memoryColor(1);
      expect(result.bgClassName).toBe("bg-danger/10");
      expect(result.textClassName).toBe("text-danger/90");
      expect(result.color).toBe("danger");
    });

    it("handles edge cases like 0 and negative values", () => {
      const zeroResult = maxMemoryScaleFactorService.memoryColor(0);
      expect(zeroResult.color).toBe("success");

      const negativeResult = maxMemoryScaleFactorService.memoryColor(-0.1);
      expect(negativeResult.color).toBe("success");
    });
  });
});
