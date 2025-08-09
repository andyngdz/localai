import { MemoryColorClasses } from "../types";

class MaxMemoryScaleFactorService {
  memoryColor(scaleFactor: number): MemoryColorClasses {
    if (scaleFactor <= 0.5) {
      return {
        bgClassName: "bg-success/10",
        textClassName: "text-success/90",
        color: "success",
      };
    } else if (scaleFactor <= 0.7) {
      return {
        bgClassName: "bg-warning/10",
        textClassName: "text-warning/90",
        color: "warning",
      };
    } else {
      return {
        bgClassName: "bg-danger/10",
        textClassName: "text-danger/90",
        color: "danger",
      };
    }
  }
}

export const maxMemoryScaleFactorService = new MaxMemoryScaleFactorService();
