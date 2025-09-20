import { createQueryClientWrapper } from '@/cores/test-utils'
import type {
  DownloadModelStartResponse,
  DownloadStepProgressResponse
} from '@/sockets'
import { socket, SocketEvents } from '@/sockets'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup, render } from '@testing-library/react'
import type { MockInstance } from '@vitest/spy'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as useDownloadWatcherStoreModule from '../../states/useDownloadWatchStore'
import { DownloadWatcher } from '../DownloadWatcher'

expect.extend(matchers)

// Mock the socket module
vi.mock('@/sockets', async () => {
  const actual = await vi.importActual('@/sockets')
  return {
    ...actual,
    socket: {
      on: vi.fn(),
      off: vi.fn()
    }
  }
})

// Mock React Query
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    useQueryClient: vi.fn()
  }
})

describe('DownloadWatcher', () => {
  let useDownloadWatcherStoreSpy: MockInstance
  let mockOnUpdatePercent: MockInstance
  let mockOnSetId: MockInstance
  let mockQueryClient: Partial<QueryClient>

  const QueryClientWrapper = createQueryClientWrapper()

  beforeEach(() => {
    // Create mock functions
    mockOnUpdatePercent = vi.fn()
    mockOnSetId = vi.fn()
    mockQueryClient = {
      invalidateQueries: vi.fn()
    }

    // Spy on the store hook
    useDownloadWatcherStoreSpy = vi.spyOn(
      useDownloadWatcherStoreModule,
      'useDownloadWatcherStore'
    )
    useDownloadWatcherStoreSpy.mockReturnValue({
      id: '',
      percent: 0.0,
      onUpdatePercent: mockOnUpdatePercent,
      onSetId: mockOnSetId
    })

    // Setup useQueryClient mock
    vi.mocked(useQueryClient).mockReturnValue(mockQueryClient as QueryClient)

    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
    cleanup()
  })

  it('renders children without modification', () => {
    const TestChild = () => <div data-testid="test-child">Test Content</div>

    const { getByTestId } = render(
      <QueryClientWrapper>
        <DownloadWatcher>
          <TestChild />
        </DownloadWatcher>
      </QueryClientWrapper>
    )

    expect(getByTestId('test-child')).toBeTruthy()
    expect(getByTestId('test-child')).toHaveTextContent('Test Content')
  })

  it('sets up socket event listeners on mount', () => {
    render(
      <QueryClientWrapper>
        <DownloadWatcher>
          <div>Child</div>
        </DownloadWatcher>
      </QueryClientWrapper>
    )

    expect(socket.on).toHaveBeenCalledWith(
      SocketEvents.DOWNLOAD_START,
      expect.any(Function)
    )
    expect(socket.on).toHaveBeenCalledWith(
      SocketEvents.DOWNLOAD_STEP_PROGRESS,
      expect.any(Function)
    )
    expect(socket.on).toHaveBeenCalledWith(
      SocketEvents.DOWNLOAD_COMPLETED,
      expect.any(Function)
    )
  })

  it('handles DOWNLOAD_START event correctly', () => {
    const startData: DownloadModelStartResponse = { id: 'model-123' }

    // Mock socket.on to immediately call the callback with test data
    vi.mocked(socket.on).mockImplementation(
      (event: string, callback: (data: DownloadModelStartResponse) => void) => {
        if (event === SocketEvents.DOWNLOAD_START) {
          callback(startData)
        }
        return socket
      }
    )

    render(
      <QueryClientWrapper>
        <DownloadWatcher>
          <div>Child</div>
        </DownloadWatcher>
      </QueryClientWrapper>
    )

    expect(mockOnSetId).toHaveBeenCalledWith('model-123')
  })

  it('handles DOWNLOAD_STEP_PROGRESS event correctly', () => {
    const progressData: DownloadStepProgressResponse = {
      id: 'model-456',
      step: 3,
      total: 10
    }

    // Mock socket.on to immediately call the callback with test data
    vi.mocked(socket.on).mockImplementation(
      (
        event: string,
        callback: (data: DownloadStepProgressResponse) => void
      ) => {
        if (event === SocketEvents.DOWNLOAD_STEP_PROGRESS) {
          callback(progressData)
        }
        return socket
      }
    )

    render(
      <QueryClientWrapper>
        <DownloadWatcher>
          <div>Child</div>
        </DownloadWatcher>
      </QueryClientWrapper>
    )

    expect(mockOnUpdatePercent).toHaveBeenCalledWith(0.3) // 3/10 = 0.3
    expect(mockOnSetId).toHaveBeenCalledWith('model-456')
  })

  it('handles DOWNLOAD_COMPLETED event correctly', () => {
    // Mock socket.on to immediately call the callback for DOWNLOAD_COMPLETED
    vi.mocked(socket.on).mockImplementation(
      (event: string, callback: () => void) => {
        if (event === SocketEvents.DOWNLOAD_COMPLETED) {
          callback()
        }
        return socket
      }
    )

    render(
      <QueryClientWrapper>
        <DownloadWatcher>
          <div>Child</div>
        </DownloadWatcher>
      </QueryClientWrapper>
    )

    expect(mockOnUpdatePercent).toHaveBeenCalledWith(0.0)
    expect(mockOnSetId).toHaveBeenCalledWith('')
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['getDownloadedModels']
    })
  })

  it('cleans up socket event listeners on unmount', () => {
    const { unmount } = render(
      <QueryClientWrapper>
        <DownloadWatcher>
          <div>Child</div>
        </DownloadWatcher>
      </QueryClientWrapper>
    )

    unmount()

    expect(socket.off).toHaveBeenCalledWith(SocketEvents.DOWNLOAD_START)
    expect(socket.off).toHaveBeenCalledWith(SocketEvents.DOWNLOAD_STEP_PROGRESS)
    expect(socket.off).toHaveBeenCalledWith(SocketEvents.DOWNLOAD_COMPLETED)
  })

  it('handles multiple progress updates correctly', () => {
    const progressUpdates = [
      { id: 'model-1', step: 1, total: 5 },
      { id: 'model-1', step: 2, total: 5 },
      { id: 'model-1', step: 3, total: 5 }
    ]

    vi.mocked(socket.on).mockImplementation(
      (
        event: string,
        callback: (data: DownloadStepProgressResponse) => void
      ) => {
        if (event === SocketEvents.DOWNLOAD_STEP_PROGRESS) {
          // Call the callback multiple times to simulate progress updates
          progressUpdates.forEach((data) => callback(data))
        }
        return socket
      }
    )

    render(
      <QueryClientWrapper>
        <DownloadWatcher>
          <div>Child</div>
        </DownloadWatcher>
      </QueryClientWrapper>
    )

    expect(mockOnUpdatePercent).toHaveBeenCalledTimes(3)
    expect(mockOnUpdatePercent).toHaveBeenNthCalledWith(1, 0.2) // 1/5
    expect(mockOnUpdatePercent).toHaveBeenNthCalledWith(2, 0.4) // 2/5
    expect(mockOnUpdatePercent).toHaveBeenNthCalledWith(3, 0.6) // 3/5
    expect(mockOnSetId).toHaveBeenCalledWith('model-1')
  })

  it('handles edge case with zero total in progress event', () => {
    const progressData: DownloadStepProgressResponse = {
      id: 'model-edge',
      step: 1,
      total: 0
    }

    vi.mocked(socket.on).mockImplementation(
      (
        event: string,
        callback: (data: DownloadStepProgressResponse) => void
      ) => {
        if (event === SocketEvents.DOWNLOAD_STEP_PROGRESS) {
          callback(progressData)
        }
        return socket
      }
    )

    render(
      <QueryClientWrapper>
        <DownloadWatcher>
          <div>Child</div>
        </DownloadWatcher>
      </QueryClientWrapper>
    )

    expect(mockOnUpdatePercent).toHaveBeenCalledWith(Infinity) // 1/0 = Infinity
    expect(mockOnSetId).toHaveBeenCalledWith('model-edge')
  })

  it('maintains proper dependency array for useEffect', () => {
    // This test ensures the useEffect dependencies are correct
    // by checking that event listeners are set up properly
    const { rerender } = render(
      <QueryClientWrapper>
        <DownloadWatcher>
          <div>Child</div>
        </DownloadWatcher>
      </QueryClientWrapper>
    )

    const initialCallCount = vi.mocked(socket.on).mock.calls.length

    // Force rerender
    rerender(
      <QueryClientWrapper>
        <DownloadWatcher>
          <div>Different Child</div>
        </DownloadWatcher>
      </QueryClientWrapper>
    )

    // Socket listeners should not be re-registered if dependencies haven't changed
    // This verifies the useEffect dependency array is working correctly
    expect(vi.mocked(socket.on)).toHaveBeenCalledTimes(initialCallCount)
  })
})
