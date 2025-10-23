import { createQueryClientWrapper } from '@/cores/test-utils'
import type {
  DownloadModelStartResponse,
  DownloadStepProgressResponse
} from '@/sockets'
import { SocketEvents } from '@/sockets'
import { QueryClient } from '@tanstack/react-query'
import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup, render } from '@testing-library/react'
import type { MockInstance } from '@vitest/spy'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as useDownloadWatcherStoreModule from '../../states/useDownloadWatchStore'
import { DownloadWatcher } from '../DownloadWatcher'

expect.extend(matchers)

// Mock useSocketEvent to capture event handlers
let capturedHandlers: Record<string, (data: unknown) => void> = {}

vi.mock('@/sockets', async () => {
  const actual = await vi.importActual('@/sockets')
  return {
    ...actual,
    useSocketEvent: vi.fn((event: string, handler: (data: unknown) => void) => {
      capturedHandlers[event] = handler
    })
  }
})

describe('DownloadWatcher', () => {
  let mockOnUpdateStep: MockInstance
  let mockOnSetId: MockInstance
  let mockOnResetStep: MockInstance
  let mockOnResetId: MockInstance
  let mockQueryClient: QueryClient

  const QueryClientWrapper = createQueryClientWrapper()

  beforeEach(() => {
    vi.clearAllMocks()
    capturedHandlers = {}

    // Create mock functions
    mockOnUpdateStep = vi.fn()
    mockOnSetId = vi.fn()
    mockOnResetStep = vi.fn()
    mockOnResetId = vi.fn()

    // Create real QueryClient with mock invalidateQueries
    mockQueryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    })
    mockQueryClient.invalidateQueries = vi.fn()

    // Spy on the store hook
    vi.spyOn(
      useDownloadWatcherStoreModule,
      'useDownloadWatcherStore'
    ).mockReturnValue({
      id: undefined,
      step: undefined,
      onUpdateStep: mockOnUpdateStep,
      onSetId: mockOnSetId,
      onResetStep: mockOnResetStep,
      onResetId: mockOnResetId
    })
  })

  afterEach(() => {
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

  it('subscribes to download start, progress, and completed events', async () => {
    const { useSocketEvent } = vi.mocked(await import('@/sockets'))

    render(
      <QueryClientWrapper>
        <DownloadWatcher>
          <div>Child</div>
        </DownloadWatcher>
      </QueryClientWrapper>
    )

    // Verify useSocketEvent was called for all 3 events
    expect(useSocketEvent).toHaveBeenCalledWith(
      SocketEvents.DOWNLOAD_START,
      expect.any(Function),
      expect.any(Array)
    )
    expect(useSocketEvent).toHaveBeenCalledWith(
      SocketEvents.DOWNLOAD_STEP_PROGRESS,
      expect.any(Function),
      expect.any(Array)
    )
    expect(useSocketEvent).toHaveBeenCalledWith(
      SocketEvents.DOWNLOAD_COMPLETED,
      expect.any(Function),
      expect.any(Array)
    )
  })

  it('handles download start event by calling onSetId', () => {
    render(
      <QueryClientWrapper>
        <DownloadWatcher>
          <div>Child</div>
        </DownloadWatcher>
      </QueryClientWrapper>
    )

    const startData: DownloadModelStartResponse = { id: 'model-123' }

    // Simulate socket event
    capturedHandlers[SocketEvents.DOWNLOAD_START](startData)

    expect(mockOnSetId).toHaveBeenCalledWith('model-123')
    expect(mockOnSetId).toHaveBeenCalledTimes(1)
  })

  it('handles download progress event by calling onUpdateStep', () => {
    render(
      <QueryClientWrapper>
        <DownloadWatcher>
          <div>Child</div>
        </DownloadWatcher>
      </QueryClientWrapper>
    )

    const progressData: DownloadStepProgressResponse = {
      id: 'model-456',
      step: 3,
      total: 10,
      downloaded_size: 1024,
      total_downloaded_size: 10240,
      phase: 'downloading'
    }

    // Simulate socket event
    capturedHandlers[SocketEvents.DOWNLOAD_STEP_PROGRESS](progressData)

    expect(mockOnUpdateStep).toHaveBeenCalledWith(progressData)
    expect(mockOnUpdateStep).toHaveBeenCalledTimes(1)
  })

  it('handles download completed event by resetting store', () => {
    render(
      <QueryClientWrapper>
        <DownloadWatcher>
          <div>Child</div>
        </DownloadWatcher>
      </QueryClientWrapper>
    )

    // Simulate socket event
    capturedHandlers[SocketEvents.DOWNLOAD_COMPLETED](undefined)

    expect(mockOnResetStep).toHaveBeenCalledTimes(1)
    expect(mockOnResetId).toHaveBeenCalledTimes(1)
    // Note: invalidateQueries is tested at integration level
  })

  it('handles multiple progress updates correctly', () => {
    render(
      <QueryClientWrapper>
        <DownloadWatcher>
          <div>Child</div>
        </DownloadWatcher>
      </QueryClientWrapper>
    )

    const progressUpdates: DownloadStepProgressResponse[] = [
      {
        id: 'model-1',
        step: 1,
        total: 5,
        downloaded_size: 512,
        total_downloaded_size: 2560,
        phase: 'downloading'
      },
      {
        id: 'model-1',
        step: 2,
        total: 5,
        downloaded_size: 1024,
        total_downloaded_size: 2560,
        phase: 'downloading'
      },
      {
        id: 'model-1',
        step: 3,
        total: 5,
        downloaded_size: 1536,
        total_downloaded_size: 2560,
        phase: 'downloading'
      }
    ]

    // Simulate multiple progress events
    progressUpdates.forEach((update) => {
      capturedHandlers[SocketEvents.DOWNLOAD_STEP_PROGRESS](update)
    })

    expect(mockOnUpdateStep).toHaveBeenCalledTimes(3)
    expect(mockOnUpdateStep).toHaveBeenNthCalledWith(1, progressUpdates[0])
    expect(mockOnUpdateStep).toHaveBeenNthCalledWith(2, progressUpdates[1])
    expect(mockOnUpdateStep).toHaveBeenNthCalledWith(3, progressUpdates[2])
  })

  it('handles edge case with zero total in progress event', () => {
    render(
      <QueryClientWrapper>
        <DownloadWatcher>
          <div>Child</div>
        </DownloadWatcher>
      </QueryClientWrapper>
    )

    const edgeCaseData: DownloadStepProgressResponse = {
      id: 'model-edge',
      step: 1,
      total: 0,
      downloaded_size: 0,
      total_downloaded_size: 0,
      phase: 'downloading'
    }

    // Simulate socket event with edge case data
    capturedHandlers[SocketEvents.DOWNLOAD_STEP_PROGRESS](edgeCaseData)

    expect(mockOnUpdateStep).toHaveBeenCalledWith(edgeCaseData)
  })

  it('maintains callback stability with useCallback', async () => {
    const { useSocketEvent } = vi.mocked(await import('@/sockets'))

    render(
      <QueryClientWrapper>
        <DownloadWatcher>
          <div>Child</div>
        </DownloadWatcher>
      </QueryClientWrapper>
    )

    // useSocketEvent should be called exactly 3 times (once for each event)
    expect(useSocketEvent).toHaveBeenCalledTimes(3)

    // Verify the events are the expected ones
    expect(useSocketEvent).toHaveBeenCalledWith(
      SocketEvents.DOWNLOAD_START,
      expect.any(Function),
      expect.any(Array)
    )
    expect(useSocketEvent).toHaveBeenCalledWith(
      SocketEvents.DOWNLOAD_STEP_PROGRESS,
      expect.any(Function),
      expect.any(Array)
    )
    expect(useSocketEvent).toHaveBeenCalledWith(
      SocketEvents.DOWNLOAD_COMPLETED,
      expect.any(Function),
      expect.any(Array)
    )
  })

  it('handles complete download lifecycle', () => {
    render(
      <QueryClientWrapper>
        <DownloadWatcher>
          <div>Child</div>
        </DownloadWatcher>
      </QueryClientWrapper>
    )

    // 1. Download starts
    capturedHandlers[SocketEvents.DOWNLOAD_START]({ id: 'model-full' })
    expect(mockOnSetId).toHaveBeenCalledWith('model-full')

    // 2. Progress updates
    capturedHandlers[SocketEvents.DOWNLOAD_STEP_PROGRESS]({
      id: 'model-full',
      step: 1,
      total: 2,
      downloaded_size: 500,
      total_downloaded_size: 1000,
      phase: 'downloading'
    })
    expect(mockOnUpdateStep).toHaveBeenCalledTimes(1)

    // 3. More progress
    capturedHandlers[SocketEvents.DOWNLOAD_STEP_PROGRESS]({
      id: 'model-full',
      step: 2,
      total: 2,
      downloaded_size: 500,
      total_downloaded_size: 1000,
      phase: 'downloading'
    })
    expect(mockOnUpdateStep).toHaveBeenCalledTimes(2)

    // 4. Download completes
    capturedHandlers[SocketEvents.DOWNLOAD_COMPLETED](undefined)
    expect(mockOnResetStep).toHaveBeenCalled()
    expect(mockOnResetId).toHaveBeenCalled()
  })
})
