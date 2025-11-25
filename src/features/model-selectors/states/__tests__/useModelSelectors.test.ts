import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useModelSelectors } from '../useModelSelectors'
import { useModelSelectorStore } from '../useModelSelectorStores'

// Mock dependencies
vi.mock('@/services/api', () => ({
  api: {
    loadModel: vi.fn().mockResolvedValue({}),
    unloadModel: vi.fn().mockResolvedValue({})
  }
}))

vi.mock('../useModelSelectorStores', () => ({
  useModelSelectorStore: vi.fn()
}))

// Mock es-toolkit isEmpty function
vi.mock('es-toolkit/compat', () => ({
  isEmpty: (value: string) => value === ''
}))

describe('useModelSelectors', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    // Default mock implementation - empty selected_model_id
    vi.mocked(useModelSelectorStore).mockReturnValue('')
  })

  it('should not load model when selected_model_id is empty', async () => {
    const mockedApi = vi.mocked(await import('@/services/api')).api
    vi.mocked(useModelSelectorStore).mockReturnValue('')

    renderHook(() => useModelSelectors())

    // Should not call loadModel when id is empty
    expect(mockedApi.loadModel).not.toHaveBeenCalled()
  })

  it('should load model when selected_model_id exists', async () => {
    const mockedApi = vi.mocked(await import('@/services/api')).api
    vi.mocked(useModelSelectorStore).mockReturnValue('llama-3')

    renderHook(() => useModelSelectors())

    // Should call loadModel with the selected model id
    await waitFor(() => {
      expect(mockedApi.loadModel).toHaveBeenCalledWith({ model_id: 'llama-3' })
    })
  })

  it('should unload model on unmount', async () => {
    const mockedApi = vi.mocked(await import('@/services/api')).api
    vi.mocked(useModelSelectorStore).mockReturnValue('llama-3')

    const { unmount } = renderHook(() => useModelSelectors())

    // Unmount the hook
    unmount()

    // Should call unloadModel on cleanup
    await waitFor(() => {
      expect(mockedApi.unloadModel).toHaveBeenCalled()
    })
  })

  it('should reload model when selected_model_id changes', async () => {
    const mockedApi = vi.mocked(await import('@/services/api')).api

    // Start with first model
    vi.mocked(useModelSelectorStore).mockReturnValue('llama-3')
    const { rerender } = renderHook(() => useModelSelectors())

    await waitFor(() => {
      expect(mockedApi.loadModel).toHaveBeenCalledWith({ model_id: 'llama-3' })
    })

    // Change to second model
    vi.mocked(useModelSelectorStore).mockReturnValue('codellama')
    rerender()

    await waitFor(() => {
      expect(mockedApi.loadModel).toHaveBeenCalledWith({
        model_id: 'codellama'
      })
    })
  })
})
