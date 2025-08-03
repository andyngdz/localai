class MaxMemoryScaleFactorService {
  memoryColor(scaleFactor: number) {
    if (scaleFactor <= 0.5) {
      return ["bg-success/10", "text-success/80", "radio-success"];
    } else if (scaleFactor <= 0.7) {
      return ["bg-warning/10", "text-warning/80", "radio-warning"];
    } else {
      return ["bg-error/10", "text-error/80", "radio-error"];
    }
  }
}

export const maxMemoryScaleFactorService = new MaxMemoryScaleFactorService();
