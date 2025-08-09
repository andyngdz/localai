import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock the heroui function
const mockHeroui = vi.fn();
vi.mock("@heroui/react", () => ({
  heroui: mockHeroui,
}));

describe("hero.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });
  it("exports heroui function result as default", async () => {
    const mockResult = { theme: "hero-ui-config" };
    mockHeroui.mockReturnValue(mockResult);

    // Dynamic import to test the default export
    const heroModule = await import("../hero");

    expect(mockHeroui).toHaveBeenCalledWith();
    expect(heroModule.default).toBe(mockResult);
  });

  it("calls heroui with no arguments", async () => {
    mockHeroui.mockReturnValue({});

    await import("../hero");

    expect(mockHeroui).toHaveBeenCalledWith();
    expect(mockHeroui).toHaveBeenCalledTimes(1);
  });

  it("returns the exact result from heroui function", async () => {
    const expectedConfig = {
      theme: {
        colors: { primary: "#000" },
        spacing: { sm: "8px" },
      },
    };

    mockHeroui.mockReturnValue(expectedConfig);

    const heroModule = await import("../hero");

    expect(heroModule.default).toEqual(expectedConfig);
    expect(heroModule.default).toBe(expectedConfig);
  });
});
