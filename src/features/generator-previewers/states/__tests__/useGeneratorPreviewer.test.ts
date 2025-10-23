import { renderHook } from '@testing-library/react'
import { useGeneratorPreviewer } from '../useGeneratorPreviewer'
import { useUseImageGenerationStore } from '@/features/generators'
import { SocketEvents } from '@/cores/sockets'
import { ImageGenerationStepEndResponse } from '@/types'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import type { UseImageGenerationStore } from '@/features/generators/states'

// Mock dependencies
vi.mock('@/features/generators', () => ({
  useUseImageGenerationStore: vi.fn()
}))

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

describe('useGeneratorPreviewer', () => {
  // Mock store values and functions
  const mockOnUpdateImageStepEnd = vi.fn()
  const mockImageStepEnds = [
    { index: 0, current_step: 10, timestep: 0.5, image_base64: 'base64data' }
  ]
  const mockItems = [{ path: '/path/to/image.png', file_name: 'image.png' }]

  beforeEach(() => {
    vi.clearAllMocks()
    capturedHandlers = {}

    // Setup mock return values
    vi.mocked(useUseImageGenerationStore).mockReturnValue({
      imageStepEnds: mockImageStepEnds,
      onUpdateImageStepEnd: mockOnUpdateImageStepEnd,
      items: mockItems,
      // Add required properties from UseImageGenerationStore that aren't used in the test
      nsfw_content_detected: [],
      onInit: vi.fn(),
      onCompleted: vi.fn(),
      onRestore: vi.fn()
    } as UseImageGenerationStore)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return imageStepEnds and items from the store', () => {
    // Arrange & Act
    const { result } = renderHook(() => useGeneratorPreviewer())

    // Assert
    expect(result.current.imageStepEnds).toBe(mockImageStepEnds)
    expect(result.current.items).toBe(mockItems)
  })

  it('should subscribe to IMAGE_GENERATION_STEP_END event', async () => {
    // Arrange & Act
    const { useSocketEvent } = vi.mocked(await import('@/cores/sockets'))
    renderHook(() => useGeneratorPreviewer())

    // Assert
    expect(useSocketEvent).toHaveBeenCalledWith(
      SocketEvents.IMAGE_GENERATION_STEP_END,
      expect.any(Function),
      expect.any(Array)
    )
  })

  it('should call onUpdateImageStepEnd when receiving socket event', () => {
    // Arrange
    renderHook(() => useGeneratorPreviewer())

    // Act - Simulate socket event
    const mockResponse: ImageGenerationStepEndResponse = {
      index: 1,
      current_step: 20,
      timestep: 0.8,
      image_base64: 'newBase64Data'
    }
    capturedHandlers[SocketEvents.IMAGE_GENERATION_STEP_END](mockResponse)

    // Assert
    expect(mockOnUpdateImageStepEnd).toHaveBeenCalledWith(mockResponse)
  })
})
