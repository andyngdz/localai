import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useDownloadedModels } from '../useDownloadedModels'
import { useDownloadedModelsQuery } from '@/services'
import { createQueryClientWrapper } from '@/cores/test-utils/query-client'
import { createMockQueryResult } from '@/cores/test-utils/query-result-mock'
import { ModelDownloaded } from '@/types'

vi.mock('@/services', () => ({
  useDownloadedModelsQuery: vi.fn()
}))

describe('useDownloadedModels', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should return empty array as default data when query returns undefined', () => {
    // Arrange
    vi.mocked(useDownloadedModelsQuery).mockReturnValue(
      createMockQueryResult<ModelDownloaded[]>(undefined)
    )

    // Act
    const { result } = renderHook(() => useDownloadedModels(), {
      wrapper: createQueryClientWrapper()
    })

    // Assert
    expect(result.current.data).toEqual([])
  })

  it('should return data from the query', () => {
    // Arrange
    const mockData: ModelDownloaded[] = [
      { model_id: 'model1', id: 1, created_at: '2023-01-01', updated_at: '2023-01-01', model_dir: '/models/model1' },
      { model_id: 'model2', id: 2, created_at: '2023-01-02', updated_at: '2023-01-02', model_dir: '/models/model2' }
    ]

    vi.mocked(useDownloadedModelsQuery).mockReturnValue(
      createMockQueryResult(mockData)
    )

    // Act
    const { result } = renderHook(() => useDownloadedModels(), {
      wrapper: createQueryClientWrapper()
    })

    // Assert
    expect(result.current.data).toEqual(mockData)
  })

  describe('onCheckDownloaded', () => {
    it('should return true when model ID exists in data', () => {
      // Arrange
      const mockData: ModelDownloaded[] = [
        { model_id: 'model1', id: 1, created_at: '2023-01-01', updated_at: '2023-01-01', model_dir: '/models/model1' },
        { model_id: 'model2', id: 2, created_at: '2023-01-02', updated_at: '2023-01-02', model_dir: '/models/model2' }
      ]

      vi.mocked(useDownloadedModelsQuery).mockReturnValue(
        createMockQueryResult(mockData)
      )

      // Act
      const { result } = renderHook(() => useDownloadedModels(), {
        wrapper: createQueryClientWrapper()
      })

      // Assert
      expect(result.current.onCheckDownloaded('model1')).toBe(true)
    })

    it('should return false when model ID does not exist in data', () => {
      // Arrange
      const mockData: ModelDownloaded[] = [
        { model_id: 'model1', id: 1, created_at: '2023-01-01', updated_at: '2023-01-01', model_dir: '/models/model1' },
        { model_id: 'model2', id: 2, created_at: '2023-01-02', updated_at: '2023-01-02', model_dir: '/models/model2' }
      ]

      vi.mocked(useDownloadedModelsQuery).mockReturnValue(
        createMockQueryResult(mockData)
      )

      // Act
      const { result } = renderHook(() => useDownloadedModels(), {
        wrapper: createQueryClientWrapper()
      })

      // Assert
      expect(result.current.onCheckDownloaded('model3')).toBe(false)
    })

    it('should return false when data is empty', () => {
      // Arrange
      vi.mocked(useDownloadedModelsQuery).mockReturnValue(
        createMockQueryResult([])
      )

      // Act
      const { result } = renderHook(() => useDownloadedModels(), {
        wrapper: createQueryClientWrapper()
      })

      // Assert
      expect(result.current.onCheckDownloaded('model1')).toBe(false)
    })
  })
})
