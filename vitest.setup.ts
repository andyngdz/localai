import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock ResizeObserver for tests since jsdom doesn't support it
// Using vi.fn() to create mock functions
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Stub the global ResizeObserver object with the mock implementation
vi.stubGlobal("ResizeObserver", ResizeObserverMock);
