import { beforeEach, describe, expect, it, vi } from 'vitest'
import { io, Socket } from 'socket.io-client'

vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    disconnect: vi.fn(),
    connect: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
  }))
}))

describe('updateSocketUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates new socket with updated URL and updates Zustand store', async () => {
    const newSocket = {
      disconnect: vi.fn(),
      connect: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn()
    } as unknown as Socket
    vi.mocked(io).mockReturnValue(newSocket)

    const { useSocketStore } = await import('../states/useSocket')
    const { updateSocketUrl } = await import('../services/update-socket-url')

    updateSocketUrl('http://localhost:8001')

    expect(io).toHaveBeenCalledWith('http://localhost:8001', {
      transports: ['websocket'],
      autoConnect: false
    })
    expect(newSocket.connect).toHaveBeenCalledTimes(1)
    expect(useSocketStore.getState().socket).toBe(newSocket)
  })
})
