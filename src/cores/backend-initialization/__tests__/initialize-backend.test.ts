import { beforeEach, describe, expect, it, vi } from 'vitest'
import { initializeBackend } from '../initialize-backend'
import { client } from '@/services/api'
import { updateSocketUrl } from '@/sockets'
import { useBackendInitStore } from '../states/useBackendInitStore'

vi.mock('@/sockets', () => ({
  updateSocketUrl: vi.fn(),
  socket: {
    connect: vi.fn()
  }
}))

const setInitializedMock = vi.fn()

vi.mock('../states/useBackendInitStore', () => ({
  useBackendInitStore: {
    getState: () => ({
      setInitialized: setInitializedMock
    })
  }
}))

describe('initializeBackend', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setInitializedMock.mockClear()
    delete (global.window as { electronAPI?: unknown }).electronAPI
  })

  it('sets default port 8000 when not in Electron', async () => {
    await initializeBackend()

    expect(client.defaults.baseURL).toBe('http://localhost:8000')
    expect(updateSocketUrl).not.toHaveBeenCalled()
  })

  it('gets dynamic port from Electron API', async () => {
    global.window.electronAPI = {
      backend: {
        getPort: vi.fn().mockResolvedValue(8001),
        startLogStream: vi.fn(),
        stopLogStream: vi.fn(),
        isLogStreaming: vi.fn(),
        onLog: vi.fn()
      }
    } as unknown as typeof window.electronAPI

    await initializeBackend()

    expect(window.electronAPI.backend.getPort).toHaveBeenCalledTimes(1)
    expect(client.defaults.baseURL).toBe('http://localhost:8001')
  })

  it('updates socket URL when port is not default', async () => {
    global.window.electronAPI = {
      backend: {
        getPort: vi.fn().mockResolvedValue(8002),
        startLogStream: vi.fn(),
        stopLogStream: vi.fn(),
        isLogStreaming: vi.fn(),
        onLog: vi.fn()
      }
    } as unknown as typeof window.electronAPI

    await initializeBackend()

    expect(updateSocketUrl).toHaveBeenCalledWith('http://localhost:8002')
  })

  it('does not update socket URL when port is default', async () => {
    global.window.electronAPI = {
      backend: {
        getPort: vi.fn().mockResolvedValue(8000),
        startLogStream: vi.fn(),
        stopLogStream: vi.fn(),
        isLogStreaming: vi.fn(),
        onLog: vi.fn()
      }
    } as unknown as typeof window.electronAPI

    await initializeBackend()

    expect(updateSocketUrl).not.toHaveBeenCalled()
  })

  it('connects socket when port is default', async () => {
    const { socket } = await import('@/sockets')

    await initializeBackend()

    expect(socket.connect).toHaveBeenCalledTimes(1)
  })

  it('signals initialization complete', async () => {
    await initializeBackend()

    expect(useBackendInitStore.getState().setInitialized).toHaveBeenCalledWith(
      true
    )
  })
})
