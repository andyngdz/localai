import { describe, expect, it } from "vitest";
import { formatter } from "../formatter";

describe("Formatter", () => {
  describe("formatBytes", () => {
    it("handles zero bytes", () => {
      expect(formatter.formatBytes(0)).toBe("0 Bytes");
    });

    it("formats bytes correctly", () => {
      expect(formatter.formatBytes(1)).toBe("1 Bytes");
      expect(formatter.formatBytes(999)).toBe("999 Bytes");
    });

    it("formats KB correctly", () => {
      expect(formatter.formatBytes(1024)).toBe("1 KB");
      expect(formatter.formatBytes(1536)).toBe("1.5 KB");
      expect(formatter.formatBytes(10240)).toBe("10 KB");
    });

    it("formats MB correctly", () => {
      expect(formatter.formatBytes(1048576)).toBe("1 MB");
      expect(formatter.formatBytes(5242880)).toBe("5 MB");
    });

    it("formats GB correctly", () => {
      expect(formatter.formatBytes(1073741824)).toBe("1 GB");
      expect(formatter.formatBytes(10737418240)).toBe("10 GB");
    });

    it("formats TB correctly", () => {
      expect(formatter.formatBytes(1099511627776)).toBe("1 TB");
    });

    it("respects decimal places parameter", () => {
      expect(formatter.formatBytes(1500, 0)).toBe("1 KB");
      expect(formatter.formatBytes(1500, 1)).toBe("1.5 KB");
      expect(formatter.formatBytes(1500, 3)).toBe("1.465 KB");
    });

    it("handles negative decimal places by using 0", () => {
      expect(formatter.formatBytes(1500, -2)).toBe("1 KB");
    });

    it("handles large numbers correctly", () => {
      expect(formatter.formatBytes(8589934592)).toBe("8 GB");
      expect(formatter.formatBytes(1125899906842624)).toBe("1 PB");
    });
  });
});
