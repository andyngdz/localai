import { vi } from "vitest";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Sets up a mocked router for Next.js tests.
 */
export const setupRouterMock = async () => {
  const mockPush = vi.fn();
  const mockBack = vi.fn();
  const mockForward = vi.fn();
  const mockRefresh = vi.fn();
  const mockReplace = vi.fn();
  const mockPrefetch = vi.fn();

  const { useRouter } = await import("next/navigation");

  vi.mocked(useRouter).mockReturnValue({
    push: mockPush,
    back: mockBack,
    forward: mockForward,
    refresh: mockRefresh,
    replace: mockReplace,
    prefetch: mockPrefetch,
  } as AppRouterInstance);

  return {
    useRouter,
    mockPush,
    mockBack,
    mockForward,
    mockRefresh,
    mockReplace,
    mockPrefetch,
  };
};
