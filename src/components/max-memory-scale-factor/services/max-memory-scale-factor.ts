import { MemoryColorClasses } from "../types";

class MaxMemoryScaleFactorService {
  memoryColor(scaleFactor: number): MemoryColorClasses {
    if (scaleFactor <= 0.5) {
      return {
        bgClassName: "bg-success/10",
        textClassName: "text-success/80",
        radioClassName: "radio-success",
      };
    } else if (scaleFactor <= 0.7) {
      return {
        bgClassName: "bg-warning/10",
        textClassName: "text-warning/80",
        radioClassName: "radio-warning",
      };
    } else {
      return {
        bgClassName: "bg-error/10",
        textClassName: "text-error/80",
        radioClassName: "radio-error",
      };
    }
  }
}

export const maxMemoryScaleFactorService = new MaxMemoryScaleFactorService();
