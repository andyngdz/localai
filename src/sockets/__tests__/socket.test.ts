import { DEFAULT_BACKEND_URL } from '@/cores/constants'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { io, Socket } from 'socket.io-client'

vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    disconnect: vi.fn(),
    connect: vi.fn(),
    on: vi.fn(),
    emit: vi.fn()
  }))
}))

describe('socket', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates socket with default URL and websocket transport', async () => {
    await import('../socket')

    expect(io).toHaveBeenCalledWith(DEFAULT_BACKEND_URL, {
      transports: ['websocket'],
      autoConnect: false
    })
  })
})

describe('updateSocketUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('disconnects and creates new socket with updated URL', async () => {
    const newSocket = {
      disconnect: vi.fn(),
      connect: vi.fn(),
      on: vi.fn(),
      emit: vi.fn()
    } as unknown as Socket
    vi.mocked(io).mockReturnValue(newSocket)

    const { socket } = await import('../socket')
    const { updateSocketUrl } = await import('../update-socket-url')

    const disconnectSpy = vi.spyOn(socket, 'disconnect')

    updateSocketUrl('http://localhost:8001')

    expect(disconnectSpy).toHaveBeenCalledTimes(1)
    expect(io).toHaveBeenCalledWith('http://localhost:8001', {
      transports: ['websocket'],
      autoConnect: false
    })
    expect(newSocket.connect).toHaveBeenCalledTimes(1)
  })
})
