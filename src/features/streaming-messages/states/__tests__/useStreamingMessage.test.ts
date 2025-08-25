import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useMessageStore } from '../useMessageStores'
import { useStreamingMessage } from '../useStreamingMessage'

// Mock the dependencies with simple vi.fn() mocks
vi.mock('@/sockets', () => ({
  socket: {
    on: vi.fn(),
    off: vi.fn()
  },
  SocketEvents: {
    DOWNLOAD_START: 'DOWNLOAD_START',
    MODEL_LOAD_COMPLETED: 'MODEL_LOAD_COMPLETED',
    DOWNLOAD_COMPLETED: 'DOWNLOAD_COMPLETED'
  }
}))

// Import mocked modules
import { socket, SocketEvents } from '@/sockets'

describe('useStreamingMessage', () => {
  // Use specific callback types to avoid 'Function' lint warnings
  let onDownloadCallback: () => void
  let onLoadCompletedCallback: () => void
  let onDownloadCompletedCallback: () => void

  beforeEach(() => {
    // Reset state
    vi.clearAllMocks()
    useMessageStore.getState().reset()

    // Setup for capturing callbacks - use type cast for vi.MockInstance
    ;(socket.on as ReturnType<typeof vi.fn>).mockImplementation(
      (event: string, callback: VoidFunction) => {
        if (event === SocketEvents.DOWNLOAD_START) {
          onDownloadCallback = callback
        } else if (event === SocketEvents.MODEL_LOAD_COMPLETED) {
          onLoadCompletedCallback = callback
        } else if (event === SocketEvents.DOWNLOAD_COMPLETED) {
          onDownloadCompletedCallback = callback
        }
      }
    )
  })

  it('subscribes to socket events on mount', () => {
    renderHook(() => useStreamingMessage())

    expect(socket.on).toHaveBeenCalledWith(SocketEvents.DOWNLOAD_START, expect.any(Function))
    expect(socket.on).toHaveBeenCalledWith(SocketEvents.MODEL_LOAD_COMPLETED, expect.any(Function))
    expect(socket.on).toHaveBeenCalledWith(SocketEvents.DOWNLOAD_COMPLETED, expect.any(Function))
  })

  it('sets message on DOWNLOAD_START', () => {
    renderHook(() => useStreamingMessage())

    // Simulate download event
    act(() => {
      onDownloadCallback()
    })

    expect(useMessageStore.getState().message).toBe('Downloading model')
  })

  it('resets message on MODEL_LOAD_COMPLETED', () => {
    // Set initial state
    useMessageStore.getState().setMessage('Downloading model')

    renderHook(() => useStreamingMessage())

    // Simulate complete event
    act(() => {
      onLoadCompletedCallback()
    })

    expect(useMessageStore.getState().message).toBe('')
  })

  it('resets message on DOWNLOAD_COMPLETED', () => {
    // Set initial state
    useMessageStore.getState().setMessage('Downloading model')

    renderHook(() => useStreamingMessage())

    // Simulate download completed event
    act(() => {
      onDownloadCompletedCallback()
    })

    expect(useMessageStore.getState().message).toBe('')
  })

  it('cleans up listeners on unmount', () => {
    const { unmount } = renderHook(() => useStreamingMessage())
    unmount()

    expect(socket.off).toHaveBeenCalledWith(SocketEvents.DOWNLOAD_START)
    expect(socket.off).toHaveBeenCalledWith(SocketEvents.MODEL_LOAD_COMPLETED)
    expect(socket.off).toHaveBeenCalledWith(SocketEvents.DOWNLOAD_COMPLETED)
  })
})
