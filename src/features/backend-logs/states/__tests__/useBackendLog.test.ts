import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useBackendLog } from '../useBackendLog'
import { useBackendLogStore } from '../useBackendLogStore'
import type { ElectronAPI, LogEntry } from '@types'

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
  const mockStartLogStream = vi.fn()
  const mockStopLogStream = vi.fn()
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
    global.window.electronAPI = {
      downloadImage: vi.fn(),
      onBackendSetupStatus: vi.fn(),
      app: {
        getVersion: vi.fn().mockResolvedValue('0.0.0')
      },
      backend: {
        getPort: vi.fn().mockResolvedValue(8000),
        startLogStream: mockStartLogStream.mockResolvedValue(undefined),
        stopLogStream: mockStopLogStream.mockResolvedValue(undefined),
        isLogStreaming: mockIsLogStreaming.mockResolvedValue(false),
        onLog: mockOnLog.mockReturnValue(() => {})
      },
      updater: {
        checkForUpdates: vi.fn().mockResolvedValue(undefined),
        downloadUpdate: vi.fn().mockResolvedValue(undefined),
        installUpdate: vi.fn().mockResolvedValue(undefined),
        getUpdateInfo: vi.fn().mockResolvedValue({ updateAvailable: false }),
        onUpdateStatus: vi.fn().mockReturnValue(() => {})
      }
    } as ElectronAPI
  })

  afterEach(() => {
    delete (global.window as { electronAPI?: ElectronAPI }).electronAPI
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

    it('should start streaming on mount', async () => {
      renderHook(() => useBackendLog())

      await waitFor(() => {
        expect(mockStartLogStream).toHaveBeenCalled()
      })
    })

    it('should unsubscribe from log events on unmount', () => {
      const mockUnsubscribe = vi.fn()
      mockOnLog.mockReturnValue(mockUnsubscribe)

      const { unmount } = renderHook(() => useBackendLog())
      unmount()

      expect(mockUnsubscribe).toHaveBeenCalled()
    })
  })

  describe('onGetLogColor', () => {
    it('should return text-danger for error level', () => {
      const { result } = renderHook(() => useBackendLog())

      expect(result.current.onGetLogColor('error')).toBe('text-danger')
    })

    it('should return text-warning for warn level', () => {
      const { result } = renderHook(() => useBackendLog())

      expect(result.current.onGetLogColor('warn')).toBe('text-warning')
    })

    it('should return text-secondary for info level', () => {
      const { result } = renderHook(() => useBackendLog())

      expect(result.current.onGetLogColor('info')).toBe('text-secondary')
    })

    it('should return text-default-700 for log level', () => {
      const { result } = renderHook(() => useBackendLog())

      expect(result.current.onGetLogColor('log')).toBe('text-default-700')
    })

    it('should return text-default-700 for unknown level', () => {
      const { result } = renderHook(() => useBackendLog())

      expect(result.current.onGetLogColor('unknown')).toBe('text-default-700')
    })
  })

  describe('startStreaming', () => {
    it('should call electronAPI.backend.startLogStream', async () => {
      const { result } = renderHook(() => useBackendLog())

      await result.current.startStreaming()

      expect(mockStartLogStream).toHaveBeenCalled()
    })

    it('should set isStreaming to true', async () => {
      const { result } = renderHook(() => useBackendLog())

      await result.current.startStreaming()

      expect(mockSetIsStreaming).toHaveBeenCalledWith(true)
    })
  })

  describe('stopStreaming', () => {
    it('should call electronAPI.backend.stopLogStream', async () => {
      const { result } = renderHook(() => useBackendLog())

      await result.current.stopStreaming()

      expect(mockStopLogStream).toHaveBeenCalled()
    })

    it('should set isStreaming to false', async () => {
      const { result } = renderHook(() => useBackendLog())

      await result.current.stopStreaming()

      expect(mockSetIsStreaming).toHaveBeenCalledWith(false)
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
        return () => {}
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
