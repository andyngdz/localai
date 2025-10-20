import '@testing-library/jest-dom/vitest'
import 'core-js/actual'
import type React from 'react'
import { afterEach, beforeEach, vi } from 'vitest'
import 'vitest-localstorage-mock'

/**
 * Global Mocks
 * Setup global mocks that are needed across all tests
 */

// Mock ResizeObserver since jsdom doesn't provide it
const createResizeObserverMock = () =>
  vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
  }))

vi.stubGlobal('ResizeObserver', createResizeObserverMock())

/**
 * Module Mocks
 * Mock external modules that cause issues in test environment
 */

// Mock framer-motion to prevent window access issues during tests
vi.mock('framer-motion', async () => {
  const actual =
    await vi.importActual<typeof import('framer-motion')>('framer-motion')
  return {
    ...actual,
    LazyMotion: ({ children }: { children: React.ReactNode }) =>
      children as React.ReactElement
  }
})

/**
 * ElectronAPI Mock
 * Provides a mock implementation of the Electron API for testing
 */

type ElectronAPI = Window['electronAPI']

const noop = (): void => {}

const createElectronAPIMock = (): ElectronAPI => ({
  downloadImage: vi.fn().mockReturnThis(),
  onBackendSetupStatus: vi.fn().mockReturnValue(noop),
  backend: {
    getPort: vi.fn().mockResolvedValue(8000),
    startLogStream: vi.fn().mockResolvedValue(undefined),
    stopLogStream: vi.fn().mockResolvedValue(undefined),
    isLogStreaming: vi.fn().mockResolvedValue(false),
    onLog: vi.fn().mockReturnValue(noop)
  },
  updater: {
    checkForUpdates: vi.fn().mockResolvedValue(undefined),
    downloadUpdate: vi.fn().mockResolvedValue(undefined),
    installUpdate: vi.fn().mockResolvedValue(undefined),
    getUpdateInfo: vi.fn().mockResolvedValue({ updateAvailable: false }),
    onUpdateStatus: vi.fn().mockReturnValue(() => {})
  }
})

/**
 * Test Setup and Cleanup
 * Configure the test environment before and after each test
 */

beforeEach(() => {
  // Setup ElectronAPI mock on window object
  Object.defineProperty(window, 'electronAPI', {
    configurable: true,
    writable: true,
    value: createElectronAPIMock()
  })
})

afterEach(() => {
  // Clean up ElectronAPI mock
  Reflect.deleteProperty(window, 'electronAPI')
})
