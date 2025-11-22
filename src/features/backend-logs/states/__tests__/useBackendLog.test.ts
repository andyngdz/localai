import { renderHook, waitFor } from '@testing-library/react'
import type { ElectronAPI, LogEntry } from '@types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useBackendLog } from '../useBackendLog'
import { useBackendLogStore } from '../useBackendLogStore'

const noop = () => {}

// Mock the store
vi.mock('../useBackendLogStore', () => ({
  useBackendLogStore: vi.fn()
}))

// Mock @tanstack/react-virtual
vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: vi.fn(() => ({
    getTotalSize: () => 1000,
    getVirtualItems: () => [],
    scrollToIndex: vi.fn()
  }))
}))

describe('useBackendLog', () => {
  const mockAddLog = vi.fn()
  const mockClearLogs = vi.fn()
  const mockSetIsStreaming = vi.fn()
  const mockIsLogStreaming = vi.fn()
  const mockOnLog = vi.fn()

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Mock store
    vi.mocked(useBackendLogStore).mockReturnValue({
      logs: [],
      isStreaming: false,
      addLog: mockAddLog,
      clearLogs: mockClearLogs,
      setIsStreaming: mockSetIsStreaming,
      reset: vi.fn()
    })

    // Mock electron API
    globalThis.window.electronAPI = {
      downloadImage: vi.fn(),
      selectFile: vi.fn().mockResolvedValue(null),
      onBackendSetupStatus: vi.fn(),
      app: {
        getVersion: vi.fn().mockResolvedValue('0.0.0')
      },
      backend: {
        getPort: vi.fn().mockResolvedValue(8000),
        isLogStreaming: mockIsLogStreaming.mockResolvedValue(false),
        onLog: mockOnLog.mockReturnValue(noop)
      },
      updater: {
        checkForUpdates: vi.fn().mockResolvedValue(undefined),
        downloadUpdate: vi.fn().mockResolvedValue(undefined),
        installUpdate: vi.fn().mockResolvedValue(undefined),
        getUpdateInfo: vi.fn().mockResolvedValue({ updateAvailable: false }),
        onUpdateStatus: vi.fn().mockReturnValue(noop)
      }
    } as ElectronAPI
  })

  afterEach(() => {
    delete (globalThis.window as { electronAPI?: ElectronAPI }).electronAPI
  })

  describe('Initial Setup', () => {
    it('should return logs from store', () => {
      const mockLogs: LogEntry[] = [
        { timestamp: Date.now(), level: 'info', message: 'Test log' }
      ]
      vi.mocked(useBackendLogStore).mockReturnValue({
        logs: mockLogs,
        isStreaming: false,
        addLog: mockAddLog,
        clearLogs: mockClearLogs,
        setIsStreaming: mockSetIsStreaming,
        reset: vi.fn()
      })

      const { result } = renderHook(() => useBackendLog())

      expect(result.current.logs).toEqual(mockLogs)
    })

    it('should return isStreaming from store', () => {
      vi.mocked(useBackendLogStore).mockReturnValue({
        logs: [],
        isStreaming: true,
        addLog: mockAddLog,
        clearLogs: mockClearLogs,
        setIsStreaming: mockSetIsStreaming,
        reset: vi.fn()
      })

      const { result } = renderHook(() => useBackendLog())

      expect(result.current.isStreaming).toBe(true)
    })

    it('should check streaming status on mount', async () => {
      renderHook(() => useBackendLog())

      await waitFor(() => {
        expect(mockIsLogStreaming).toHaveBeenCalled()
      })
    })

    it('should subscribe to log events on mount', () => {
      renderHook(() => useBackendLog())

      expect(mockOnLog).toHaveBeenCalled()
    })

    it('should unsubscribe from log events on unmount', () => {
      const mockUnsubscribe = vi.fn()
      mockOnLog.mockReturnValue(mockUnsubscribe)

      const { unmount } = renderHook(() => useBackendLog())
      unmount()

      expect(mockUnsubscribe).toHaveBeenCalled()
    })
  })

  describe('clearLogs', () => {
    it('should expose clearLogs from store', () => {
      const { result } = renderHook(() => useBackendLog())

      result.current.clearLogs()

      expect(mockClearLogs).toHaveBeenCalled()
    })
  })

  describe('Log Event Handler', () => {
    it('should add log when onLog callback is called', async () => {
      let logCallback: ((log: LogEntry) => void) | undefined

      mockOnLog.mockImplementation((callback) => {
        logCallback = callback
        return noop
      })

      renderHook(() => useBackendLog())

      await waitFor(() => {
        expect(mockOnLog).toHaveBeenCalled()
      })

      const testLog: LogEntry = {
        timestamp: Date.now(),
        level: 'info',
        message: 'Test message'
      }

      logCallback?.(testLog)

      expect(mockAddLog).toHaveBeenCalledWith(testLog)
    })
  })

  describe('Virtual Scroller', () => {
    it('should return rowVirtualizer', () => {
      const { result } = renderHook(() => useBackendLog())

      expect(result.current.rowVirtualizer).toBeDefined()
    })

    it('should return scrollRef', () => {
      const { result } = renderHook(() => useBackendLog())

      expect(result.current.scrollRef).toBeDefined()
      expect(result.current.scrollRef.current).toBeNull()
    })

    it('should auto-scroll to bottom when logs change', async () => {
      const { result, rerender } = renderHook(() => useBackendLog())

      const mockScrollElement = {
        scrollTop: 0,
        scrollHeight: 1000
      } as HTMLDivElement

      result.current.scrollRef.current = mockScrollElement

      const newLogs: LogEntry[] = [
        { timestamp: Date.now(), level: 'info', message: 'New log' }
      ]
      vi.mocked(useBackendLogStore).mockReturnValue({
        logs: newLogs,
        isStreaming: false,
        addLog: mockAddLog,
        clearLogs: mockClearLogs,
        setIsStreaming: mockSetIsStreaming,
        reset: vi.fn()
      })

      rerender()

      await waitFor(() => {
        expect(mockScrollElement.scrollTop).toBe(1000)
      })
    })

    it('should not throw when scrollRef is null', async () => {
      const { rerender } = renderHook(() => useBackendLog())

      const newLogs: LogEntry[] = [
        { timestamp: Date.now(), level: 'info', message: 'New log' }
      ]
      vi.mocked(useBackendLogStore).mockReturnValue({
        logs: newLogs,
        isStreaming: false,
        addLog: mockAddLog,
        clearLogs: mockClearLogs,
        setIsStreaming: mockSetIsStreaming,
        reset: vi.fn()
      })

      expect(() => rerender()).not.toThrow()
    })
  })
})
