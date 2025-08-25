import { renderHook } from '@testing-library/react'
import { useDownloadButton } from '../useDownloadButton'
import { api } from '@/services'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the API module
vi.mock('@/services', () => ({
  api: {
    downloadModel: vi.fn()
  }
}))

describe('useDownloadButton', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns onDownload function', () => {
    // Arrange
    const modelId = 'test-model-id'

    // Act
    const { result } = renderHook(() => useDownloadButton(modelId))

    // Assert
    expect(result.current).toHaveProperty('onDownload')
    expect(typeof result.current.onDownload).toBe('function')
  })

  it('calls api.downloadModel with correct ID when onDownload is called', () => {
    // Arrange
    const modelId = 'test-model-id'

    // Act
    const { result } = renderHook(() => useDownloadButton(modelId))
    result.current.onDownload()

    // Assert
    expect(api.downloadModel).toHaveBeenCalledTimes(1)
    expect(api.downloadModel).toHaveBeenCalledWith(modelId)
  })

  it('handles empty ID gracefully', () => {
    // Arrange
    const modelId = ''

    // Act
    const { result } = renderHook(() => useDownloadButton(modelId))
    result.current.onDownload()

    // Assert
    expect(api.downloadModel).toHaveBeenCalledTimes(1)
    expect(api.downloadModel).toHaveBeenCalledWith('')
  })
})
