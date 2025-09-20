import type { ModelDownloaded } from '@/types/api'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api'
import {
  useDownloadedModelsQuery,
  useHardwareQuery,
  useHealthQuery,
  useHistoriesQuery,
  useMemoryQuery,
  useModelRecommendationsQuery,
  useStyleSectionsQuery
} from '../queries'

// Mock the API service
vi.mock('../api', () => ({
  api: {
    health: vi.fn(),
    getHardwareStatus: vi.fn(),
    getMemory: vi.fn(),
    getModelRecommendations: vi.fn(),
    getDownloadedModels: vi.fn(),
    styles: vi.fn(),
    getHistories: vi.fn()
  }
}))

/**
 * Creates a testing environment with a fresh QueryClient for React Query hooks
 */
const createQueryTestingEnvironment = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  })

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)

  return {
    queryClient,
    wrapper
  }
}

describe('React Query Hooks', () => {
  // Test utility setup
  let testEnv: ReturnType<typeof createQueryTestingEnvironment>

  beforeEach(() => {
    testEnv = createQueryTestingEnvironment()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    testEnv.queryClient.clear()
  })

  describe('useHealthQuery', () => {
    it('calls api.health and returns the data', async () => {
      const mockResponse = { status: 'ok', message: 'Server is healthy' }
      vi.mocked(api.health).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useHealthQuery(), {
        wrapper: testEnv.wrapper
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(api.health).toHaveBeenCalled()
      expect(result.current.data).toEqual(mockResponse)
    })

    it('handles error', async () => {
      const mockError = new Error('Network error')
      vi.mocked(api.health).mockRejectedValue(mockError)

      const { result } = renderHook(() => useHealthQuery(), {
        wrapper: testEnv.wrapper
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(api.health).toHaveBeenCalled()
    })
  })

  describe('useHardwareQuery', () => {
    it('calls api.getHardwareStatus and returns the data', async () => {
      const mockResponse = {
        is_cuda: true,
        cuda_runtime_version: '11.8',
        nvidia_driver_version: '520.61.05',
        gpus: [
          {
            name: 'NVIDIA GeForce RTX 3090',
            memory: 24576,
            cuda_compute_capability: '8.6',
            is_primary: true
          }
        ],
        message: 'CUDA is available'
      }
      vi.mocked(api.getHardwareStatus).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useHardwareQuery(), {
        wrapper: testEnv.wrapper
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(api.getHardwareStatus).toHaveBeenCalled()
      expect(result.current.data).toEqual(mockResponse)
    })
  })

  describe('useMemoryQuery', () => {
    it('calls api.getMemory and returns the data', async () => {
      const mockResponse = { gpu: 24576000000, ram: 32000000000 }
      vi.mocked(api.getMemory).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useMemoryQuery(), {
        wrapper: testEnv.wrapper
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(api.getMemory).toHaveBeenCalled()
      expect(result.current.data).toEqual(mockResponse)
    })
  })

  describe('useModelRecommendationsQuery', () => {
    it('calls api.getModelRecommendations and returns the data', async () => {
      const mockResponse = {
        sections: [
          {
            id: 'section1',
            name: 'Section 1',
            description: 'Test section',
            models: [
              {
                id: 'model1',
                name: 'Model 1',
                description: 'Test model',
                memory_requirement_gb: 4,
                model_size: 'Medium',
                tags: ['tag1', 'tag2'],
                is_recommended: true
              }
            ],
            is_recommended: true
          }
        ],
        default_section: 'section1',
        default_selected_id: 'model1'
      }
      vi.mocked(api.getModelRecommendations).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useModelRecommendationsQuery(), {
        wrapper: testEnv.wrapper
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(api.getModelRecommendations).toHaveBeenCalled()
      expect(result.current.data).toEqual(mockResponse)
    })
  })

  describe('useDownloadedModelsQuery', () => {
    it('calls api.getDownloadedModels and returns data', async () => {
      const mockResponse: ModelDownloaded[] = [
        {
          created_at: '2025-01-01T00:00:00Z',
          id: 1,
          model_id: 'model-1',
          model_dir: '/models/model-1',
          updated_at: '2025-01-01T00:00:00Z'
        },
        {
          created_at: '2025-01-02T00:00:00Z',
          id: 2,
          model_id: 'model-2',
          model_dir: '/models/model-2',
          updated_at: '2025-01-02T00:00:00Z'
        }
      ]
      vi.mocked(api.getDownloadedModels).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useDownloadedModelsQuery(), {
        wrapper: testEnv.wrapper
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(api.getDownloadedModels).toHaveBeenCalled()
      expect(result.current.data).toEqual(mockResponse)
    })
  })

  describe('useStyleSectionsQuery', () => {
    it('calls api.styles and returns data', async () => {
      const mockResponse = [
        {
          id: 'section1',
          styles: [
            {
              id: 'style1',
              name: 'Style 1',
              origin: 'test',
              license: 'MIT',
              positive: 'beautiful, stunning',
              negative: 'ugly, blurry',
              image: 'style1.jpg'
            }
          ]
        }
      ]
      vi.mocked(api.styles).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useStyleSectionsQuery(), {
        wrapper: testEnv.wrapper
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(api.styles).toHaveBeenCalled()
      expect(result.current.data).toEqual(mockResponse)
    })
  })

  describe('useHistoriesQuery', () => {
    it('calls api.getHistories and returns data', async () => {
      const mockResponse = [
        {
          id: 1,
          model: 'stable-diffusion-xl',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:30:00Z',
          prompt: 'a beautiful landscape',
          config: {
            width: 1024,
            height: 1024,
            hires_fix: false,
            number_of_images: 4,
            prompt: 'a beautiful landscape',
            negative_prompt: 'blurry, low quality',
            cfg_scale: 7.5,
            steps: 30,
            seed: 12345,
            sampler: 'DPM++ 2M Karras',
            styles: ['photorealistic']
          },
          generated_images: [
            {
              id: 101,
              path: '/images/landscape1.png',
              file_name: 'landscape1.png',
              is_nsfw: false,
              history_id: 1,
              created_at: '2024-01-01T00:25:00Z',
              updated_at: '2024-01-01T00:25:00Z'
            },
            {
              id: 102,
              path: '/images/landscape2.png',
              file_name: 'landscape2.png',
              is_nsfw: false,
              history_id: 1,
              created_at: '2024-01-01T00:26:00Z',
              updated_at: '2024-01-01T00:26:00Z'
            }
          ]
        }
      ]
      vi.mocked(api.getHistories).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useHistoriesQuery(), {
        wrapper: testEnv.wrapper
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(api.getHistories).toHaveBeenCalled()
      expect(result.current.data).toEqual(mockResponse)
    })

    it('handles empty history list', async () => {
      const mockResponse: never[] = []
      vi.mocked(api.getHistories).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useHistoriesQuery(), {
        wrapper: testEnv.wrapper
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(api.getHistories).toHaveBeenCalled()
      expect(result.current.data).toEqual([])
    })

    it('handles error state', async () => {
      const mockError = new Error('Failed to fetch histories')
      vi.mocked(api.getHistories).mockRejectedValue(mockError)

      const { result } = renderHook(() => useHistoriesQuery(), {
        wrapper: testEnv.wrapper
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(api.getHistories).toHaveBeenCalled()
      expect(result.current.error).toBeDefined()
    })
  })
})
