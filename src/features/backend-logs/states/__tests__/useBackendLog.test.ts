import { renderHook, waitFor } from '@testing-library/react'
import type { LogEntry } from '@types'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useBackendLog } from '../useBackendLog'
import { useBackendLogStore } from '../useBackendLogStore'

vi.mock('../useBackendLogStore', () => ({
  useBackendLogStore: vi.fn()
}))

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: vi.fn(() => ({
    getTotalSize: () => 1000,
    getVirtualItems: () => [],
    scrollToIndex: vi.fn(),
    measureElement: vi.fn()
  }))
}))

describe('useBackendLog', () => {
  const mockClearLogs = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useBackendLogStore).mockReturnValue({
      logs: [],
      isStreaming: false,
      addLog: vi.fn(),
      clearLogs: mockClearLogs,
      setIsStreaming: vi.fn(),
      reset: vi.fn()
    })
  })

  describe('Initial Setup', () => {
    it('should return logs from store', () => {
      const mockLogs: LogEntry[] = [
        { timestamp: Date.now(), level: 'info', message: 'Test log' }
      ]

      vi.mocked(useBackendLogStore).mockReturnValue({
        logs: mockLogs,
        isStreaming: false,
        addLog: vi.fn(),
        clearLogs: mockClearLogs,
        setIsStreaming: vi.fn(),
        reset: vi.fn()
      })

      const { result } = renderHook(() => useBackendLog())

      expect(result.current.logs).toEqual(mockLogs)
    })

    it('should return isStreaming from store', () => {
      vi.mocked(useBackendLogStore).mockReturnValue({
        logs: [],
        isStreaming: true,
        addLog: vi.fn(),
        clearLogs: mockClearLogs,
        setIsStreaming: vi.fn(),
        reset: vi.fn()
      })

      const { result } = renderHook(() => useBackendLog())

      expect(result.current.isStreaming).toBe(true)
    })
  })

  describe('clearLogs', () => {
    it('should expose clearLogs from store', () => {
      const { result } = renderHook(() => useBackendLog())

      result.current.clearLogs()

      expect(mockClearLogs).toHaveBeenCalled()
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
        scrollHeight: 1000,
        scrollTo: vi.fn()
      } as unknown as HTMLDivElement

      mockScrollElement.scrollTo = vi.fn((options: ScrollToOptions) => {
        if (options?.top) {
          mockScrollElement.scrollTop = options.top
        }
      }) as typeof mockScrollElement.scrollTo

      result.current.scrollRef.current = mockScrollElement

      const newLogs: LogEntry[] = [
        { timestamp: Date.now(), level: 'info', message: 'New log' }
      ]

      vi.mocked(useBackendLogStore).mockReturnValue({
        logs: newLogs,
        isStreaming: false,
        addLog: vi.fn(),
        clearLogs: mockClearLogs,
        setIsStreaming: vi.fn(),
        reset: vi.fn()
      })

      rerender()

      await waitFor(() => {
        expect(mockScrollElement.scrollTop).toBe(1000)
      })
    })

    it('should not throw when scrollRef is null', () => {
      const { rerender } = renderHook(() => useBackendLog())

      const newLogs: LogEntry[] = [
        { timestamp: Date.now(), level: 'info', message: 'New log' }
      ]

      vi.mocked(useBackendLogStore).mockReturnValue({
        logs: newLogs,
        isStreaming: false,
        addLog: vi.fn(),
        clearLogs: mockClearLogs,
        setIsStreaming: vi.fn(),
        reset: vi.fn()
      })

      expect(() => rerender()).not.toThrow()
    })
  })
})
