import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock ResizeObserver for tests since jsdom doesn't support it
// Using vi.fn() to create mock functions
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
