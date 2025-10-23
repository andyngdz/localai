import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useMessageStore } from '../useMessageStores'
import { useStreamingMessage } from '../useStreamingMessage'
import { SocketEvents } from '@/cores/sockets'

// Mock useSocketEvent to capture handlers
let capturedHandlers: Record<string, (data: unknown) => void> = {}

vi.mock('@/cores/sockets', async () => {
  const actual = await vi.importActual('@/cores/sockets')
  return {
    ...actual,
    useSocketEvent: vi.fn((event: string, handler: (data: unknown) => void) => {
      capturedHandlers[event] = handler
    })
  }
})

describe('useStreamingMessage', () => {
  beforeEach(() => {
    // Reset state
    vi.clearAllMocks()
    capturedHandlers = {}
    useMessageStore.getState().reset()
  })

  it('subscribes to socket events', async () => {
    const { useSocketEvent } = vi.mocked(await import('@/cores/sockets'))
    renderHook(() => useStreamingMessage())

    expect(useSocketEvent).toHaveBeenCalledWith(
      SocketEvents.MODEL_LOAD_COMPLETED,
      expect.any(Function),
      expect.any(Array)
    )
    expect(useSocketEvent).toHaveBeenCalledWith(
      SocketEvents.DOWNLOAD_COMPLETED,
      expect.any(Function),
      expect.any(Array)
    )
  })

  it('resets message on MODEL_LOAD_COMPLETED', () => {
    // Set initial state
    useMessageStore.getState().setMessage('Loading model')

    renderHook(() => useStreamingMessage())

    // Simulate event
    act(() => {
      capturedHandlers[SocketEvents.MODEL_LOAD_COMPLETED](undefined)
    })

    expect(useMessageStore.getState().message).toBe('')
  })

  it('resets message on DOWNLOAD_COMPLETED', () => {
    // Set initial state
    useMessageStore.getState().setMessage('Downloading model')

    renderHook(() => useStreamingMessage())

    // Simulate event
    act(() => {
      capturedHandlers[SocketEvents.DOWNLOAD_COMPLETED](undefined)
    })

    expect(useMessageStore.getState().message).toBe('')
  })
})
