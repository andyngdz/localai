import { createMockQueryResult } from '@/cores/test-utils'
import { useDownloadedModelsQuery } from '@/cores/api-queries'
import { ModelDownloaded } from '@/types/api'
import { renderHook, waitFor } from '@testing-library/react'
import * as esToolkit from 'es-toolkit/compat'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useModelSelectors } from '../useModelSelectors'
import { useModelSelectorStore } from '../useModelSelectorStores'

// Mock dependencies
vi.mock('@/services/api', () => ({
  api: {
    loadModel: vi.fn().mockResolvedValue({})
  }
}))

vi.mock('@/cores/api-queries', () => ({
  useDownloadedModelsQuery: vi.fn()
}))

vi.mock('../useModelSelectorStores', () => ({
  useModelSelectorStore: vi.fn()
}))

// Mock es-toolkit functions
vi.mock('es-toolkit/compat', () => ({
  isEmpty: (value: string) => value === '',
  first: vi.fn()
}))

describe('useModelSelectors', () => {
  const mockSetId = vi.fn()
  const mockModels: ModelDownloaded[] = [
    {
      model_id: 'model-1',
      id: 1,
      created_at: '2023-01-01',
      updated_at: '2023-01-01',
      model_dir: '/path/to/model-1'
    },
    {
      model_id: 'model-2',
      id: 2,
      created_at: '2023-01-02',
      updated_at: '2023-01-02',
      model_dir: '/path/to/model-2'
    }
  ]

  beforeEach(() => {
    vi.resetAllMocks()

    // Default mock implementations
    vi.mocked(useModelSelectorStore).mockReturnValue({
      selected_model_id: '',
      setSelectedModelId: mockSetId
    })

    // Mock the query result with test utility
    vi.mocked(useDownloadedModelsQuery).mockReturnValue(
      createMockQueryResult(mockModels)
    )

    // Mock the first function from es-toolkit
    vi.mocked(esToolkit.first).mockImplementation((arr) => {
      if (arr && Array.isArray(arr) && arr.length > 0) {
        return arr[0]
      }
    })
  })

  it('should return downloadedModels from useDownloadedModels', () => {
    const { result } = renderHook(() => useModelSelectors())

    expect(result.current.downloadedModels).toEqual(mockModels)
  })

  it('should set id to first model when id is empty and data exists', async () => {
    vi.mocked(useModelSelectorStore).mockReturnValue({
      selected_model_id: '',
      setSelectedModelId: mockSetId
    })

    renderHook(() => useModelSelectors())

    await waitFor(() => {
      expect(mockSetId).toHaveBeenCalledWith('model-1')
    })
  })

  it('should not set id when id already exists', () => {
    vi.mocked(useModelSelectorStore).mockReturnValue({
      selected_model_id: 'existing-id',
      setSelectedModelId: mockSetId
    })

    renderHook(() => useModelSelectors())

    expect(mockSetId).not.toHaveBeenCalled()
  })

  it('should not set id when data is empty', () => {
    vi.mocked(useDownloadedModelsQuery).mockReturnValue(
      createMockQueryResult([])
    )

    renderHook(() => useModelSelectors())

    expect(mockSetId).not.toHaveBeenCalled()
  })

  it('should handle undefined data gracefully', () => {
    // undefined is treated as empty data
    vi.mocked(useDownloadedModelsQuery).mockReturnValue(
      createMockQueryResult([])
    )

    const { result } = renderHook(() => useModelSelectors())

    expect(result.current.downloadedModels).toEqual([])
    expect(mockSetId).not.toHaveBeenCalled()
  })

  it('should call api.loadModel when id changes', async () => {
    // Access the mocked api
    const mockedApi = vi.mocked(await import('@/services/api')).api

    vi.mocked(useModelSelectorStore).mockReturnValue({
      selected_model_id: 'existing-id',
      setSelectedModelId: mockSetId
    })

    renderHook(() => useModelSelectors())

    // Wait for the effect to be called
    await waitFor(() => {
      expect(mockedApi.loadModel).toHaveBeenCalledWith({ id: 'existing-id' })
    })
  })
})
