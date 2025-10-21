import { useModelRecommendationsQuery } from '@/cores/api-queries'
import { socket, SocketEvents } from '@/sockets'
import { act, renderHook } from '@testing-library/react'
import { setupRouterMock } from '@/cores/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useModelRecommendation } from '../useModelRecommendation'
import { Socket } from 'socket.io-client'

vi.mock('@/cores/api-queries')
vi.mock('@/sockets', async (originalImport: () => Promise<Socket>) => {
  const actual = await originalImport()
  return {
    ...actual,
    socket: {
      on: vi.fn(),
      off: vi.fn()
    },
    SocketEvents: {
      DOWNLOAD_COMPLETED: 'DOWNLOAD_COMPLETED'
    }
  }
})
vi.mock('next/navigation', () => ({ useRouter: vi.fn() }))

describe('useModelRecommendation', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    await setupRouterMock()
  })

  it('should return data from query', () => {
    const mockData = { default_selected_id: 'test-id' }
    vi.mocked(useModelRecommendationsQuery).mockReturnValue({
      data: mockData
    } as ReturnType<typeof useModelRecommendationsQuery>)

    const { result } = renderHook(() => useModelRecommendation())

    expect(result.current.data).toEqual(mockData)
  })

  it('should navigate to editor on DOWNLOAD_COMPLETED and clean up on unmount', async () => {
    vi.mocked(useModelRecommendationsQuery).mockReturnValue({
      data: {}
    } as ReturnType<typeof useModelRecommendationsQuery>)

    // Set up router mock
    const { mockReplace } = await setupRouterMock()

    // Mock the socket.on and socket.off methods
    vi.spyOn(socket, 'on').mockImplementation(
      (event: string, cb: VoidFunction) => {
        if (event === SocketEvents.DOWNLOAD_COMPLETED) {
          cb() // Immediately call the callback to trigger navigation
        }
        return socket // Return the socket object as per socket.io API
      }
    )

    const { unmount } = renderHook(() => useModelRecommendation())

    // Check that navigation happened
    expect(mockReplace).toHaveBeenCalledWith('/editor')
    expect(socket.on).toHaveBeenCalledWith(
      SocketEvents.DOWNLOAD_COMPLETED,
      expect.any(Function)
    )

    // Unmount the hook to trigger cleanup
    unmount()

    // Verify that socket.off was called with the correct event
    expect(socket.off).toHaveBeenCalledWith(
      SocketEvents.DOWNLOAD_COMPLETED,
      expect.any(Function)
    )
  })

  it('should navigate to editor when onNext is called', async () => {
    vi.mocked(useModelRecommendationsQuery).mockReturnValue({
      data: {}
    } as ReturnType<typeof useModelRecommendationsQuery>)

    const { mockReplace } = await setupRouterMock()

    const { result } = renderHook(() => useModelRecommendation())

    await act(async () => {
      result.current.onNext()
    })

    expect(mockReplace).toHaveBeenCalledWith('/editor')
  })
})
