import '@testing-library/jest-dom/vitest';
import 'core-js/actual';
import type React from 'react';
import { vi } from 'vitest';

// Mock ResizeObserver for tests since jsdom doesn't support it
// Using vi.fn() to create mock functions
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Stub the global ResizeObserver object with the mock implementation
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// Partially mock framer-motion to avoid window access during tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    LazyMotion: ({ children }: { children: React.ReactNode }) => children as React.ReactElement,
  };
});
