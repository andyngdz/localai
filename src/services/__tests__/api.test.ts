import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { api, client } from '../api'

// Mock axios
vi.mock('axios', () => {
  return {
    default: {
      create: () => ({
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn()
      })
    }
  }
})

describe('API Service', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('health', () => {
    it('fetches health status', async () => {
      const mockResponse = { status: 'ok', message: 'Server is healthy' }
      vi.spyOn(client, 'get').mockResolvedValueOnce({ data: mockResponse })

      const result = await api.health()

      expect(client.get).toHaveBeenCalledWith('/')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getHardwareStatus', () => {
    it('fetches hardware status', async () => {
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
      vi.spyOn(client, 'get').mockResolvedValueOnce({ data: mockResponse })

      const result = await api.getHardwareStatus()

      expect(client.get).toHaveBeenCalledWith('/hardware/')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('setMaxMemory', () => {
    it('sends max memory configuration', async () => {
      const request = { gpu_scale_factor: 0.7, ram_scale_factor: 0.7 }
      vi.spyOn(client, 'post').mockResolvedValueOnce({})

      await api.setMaxMemory(request)

      expect(client.post).toHaveBeenCalledWith('/hardware/max-memory', request)
    })
  })

  describe('getMemory', () => {
    it('fetches memory information', async () => {
      const mockResponse = { gpu: 24576000000, ram: 32000000000 }
      vi.spyOn(client, 'get').mockResolvedValueOnce({ data: mockResponse })

      const result = await api.getMemory()

      expect(client.get).toHaveBeenCalledWith('/hardware/memory')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('selectDevice', () => {
    it('selects a device', async () => {
      const request = { device_index: 0 }
      vi.spyOn(client, 'post').mockResolvedValueOnce({})

      await api.selectDevice(request)

      expect(client.post).toHaveBeenCalledWith('/hardware/device', request)
    })
  })

  describe('getDeviceIndex', () => {
    it('fetches device index', async () => {
      const mockResponse = { device_index: 1 }
      vi.spyOn(client, 'get').mockResolvedValueOnce({ data: mockResponse })

      const result = await api.getDeviceIndex()

      expect(client.get).toHaveBeenCalledWith('/hardware/device')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getModelRecommendations', () => {
    it('fetches model recommendations', async () => {
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
      vi.spyOn(client, 'get').mockResolvedValueOnce({ data: mockResponse })

      const result = await api.getModelRecommendations()

      expect(client.get).toHaveBeenCalledWith('/models/recommendations')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('searchModel', () => {
    it('fetches model search results', async () => {
      const modelName = 'sdxl'
      const mockResponse = {
        models_search_info: [
          {
            id: 'org/model',
            author: 'author',
            likes: 10,
            downloads: 100,
            tags: ['sd', 'diffusion'],
            is_downloaded: false
          }
        ]
      }
      vi.spyOn(client, 'get').mockResolvedValueOnce({ data: mockResponse })

      const result = await api.searchModel(modelName)

      expect(client.get).toHaveBeenCalledWith(`/models/search?model_name=${modelName}`)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('modelDetails', () => {
    it('fetches model details', async () => {
      const modelId = 'org/model'
      const mockResponse = {
        author: 'author',
        created_at: '2024-01-01T00:00:00Z',
        disabled: false,
        downloads: 100,
        gated: 'none',
        id: modelId,
        last_modified: '2024-01-02T00:00:00Z',
        library_name: 'diffusers',
        likes: 10,
        pipeline_tag: ['text-to-image'],
        private: false,
        sha: 'abcdef',
        siblings: [{ blob_id: 'b1', rfilename: 'model.safetensors', size: 123456 }],
        spaces: [],
        tags: ['sd', 'diffusion']
      }
      vi.spyOn(client, 'get').mockResolvedValueOnce({ data: mockResponse })

      const result = await api.modelDetails(modelId)

      expect(client.get).toHaveBeenCalledWith(`/models/details?id=${modelId}`)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('downloadModel', () => {
    it('initiates model download', async () => {
      const modelId = 'model1'

      await api.downloadModel(modelId)

      expect(client.post).toHaveBeenCalledWith('/downloads/', { id: modelId })
    })
  })

  describe('styles', () => {
    it('fetches styles', async () => {
      const mockResponse = [
        {
          id: 'style1',
          name: 'Style 1',
          description: 'Test style',
          preprompt: 'preprompt',
          prompt: 'prompt',
          negative_prompt: 'negative_prompt',
          model_id: 'model1'
        }
      ]
      vi.spyOn(client, 'get').mockResolvedValueOnce({ data: mockResponse })

      const result = await api.styles()

      expect(client.get).toHaveBeenCalledWith('/styles')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getDownloadedModels', () => {
    it('fetches downloaded models', async () => {
      const mockResponse = [
        {
          id: 'model1',
          name: 'Model 1',
          description: 'Test model',
          memory_requirement_gb: 4,
          model_size: 'Medium',
          tags: ['tag1', 'tag2'],
          is_recommended: true
        }
      ]
      vi.spyOn(client, 'get').mockResolvedValueOnce({ data: mockResponse })

      const result = await api.getDownloadedModels()

      expect(client.get).toHaveBeenCalledWith('/models/downloaded')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('addHistory', () => {
    it('adds a history entry', async () => {
      const mockConfig = {
        prompt: 'a cat',
        negative_prompt: 'a dog',
        seed: 123,
        steps: 20,
        width: 512,
        height: 512,
        styles: ['style1'],
        model: 'model1',
        guidance_scale: 7.5,
        sampler: 'Euler a',
        number_of_images: 1,
        hires_fix: false,
        cfg_scale: 7
      }
      const mockResponse = 1
      vi.spyOn(client, 'post').mockResolvedValueOnce({ data: mockResponse })

      const result = await api.addHistory(mockConfig)

      expect(client.post).toHaveBeenCalledWith('/histories', mockConfig)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('loadModel', () => {
    it('calls POST /models/load and returns the data', async () => {
      const request = { id: 'model1' }
      const mockResponse = { status: 'loaded', id: 'model1' }
      vi.spyOn(client, 'post').mockResolvedValueOnce({ data: mockResponse })

      const result = await api.loadModel(request)

      expect(client.post).toHaveBeenCalledWith('/models/load', request)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('generator', () => {
    it('calls POST /generators and returns ImageGenerationResponse data', async () => {
      const request = {
        history_id: 1,
        config: {
          prompt: 'a cat',
          negative_prompt: '',
          seed: 123,
          steps: 20,
          width: 512,
          height: 512,
          styles: [],
          number_of_images: 1,
          hires_fix: false,
          cfg_scale: 7
        }
      }
      const mockResponse = {
        items: [
          {
            path: '/images/img1.png',
            file_name: 'img1.png'
          }
        ],
        nsfw_content_detected: [false]
      }
      vi.spyOn(client, 'post').mockResolvedValueOnce({ data: mockResponse })

      const result = await api.generator(request)

      expect(client.post).toHaveBeenCalledWith('/generators', request)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getHistories', () => {
    it('fetches all history items', async () => {
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
        },
        {
          id: 2,
          model: 'stable-diffusion-xl',
          created_at: '2024-01-02T10:00:00Z',
          updated_at: '2024-01-02T10:15:00Z',
          prompt: 'a futuristic cityscape',
          config: {
            width: 768,
            height: 768,
            hires_fix: true,
            number_of_images: 2,
            prompt: 'a futuristic cityscape',
            negative_prompt: 'vintage, old',
            cfg_scale: 8.0,
            steps: 25,
            seed: 67890,
            sampler: 'Euler a',
            styles: ['cyberpunk', 'neon']
          },
          generated_images: [
            {
              id: 103,
              path: '/images/cityscape1.png',
              file_name: 'cityscape1.png',
              is_nsfw: false,
              history_id: 2,
              created_at: '2024-01-02T10:12:00Z',
              updated_at: '2024-01-02T10:12:00Z'
            }
          ]
        }
      ]
      vi.spyOn(client, 'get').mockResolvedValueOnce({ data: mockResponse })

      const result = await api.getHistories()

      expect(client.get).toHaveBeenCalledWith('/histories')
      expect(result).toEqual(mockResponse)
      expect(result).toHaveLength(2)
      expect(result[0]).toHaveProperty('id', 1)
      expect(result[0]).toHaveProperty('model', 'stable-diffusion-xl')
      expect(result[0]).toHaveProperty('prompt', 'a beautiful landscape')
      expect(result[0].config).toHaveProperty('width', 1024)
      expect(result[0].generated_images).toHaveLength(2)
      expect(result[1]).toHaveProperty('id', 2)
      expect(result[1].generated_images).toHaveLength(1)
    })

    it('handles empty history list', async () => {
      const mockResponse: never[] = []
      vi.spyOn(client, 'get').mockResolvedValueOnce({ data: mockResponse })

      const result = await api.getHistories()

      expect(client.get).toHaveBeenCalledWith('/histories')
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    it('handles API error gracefully', async () => {
      const errorMessage = 'Failed to fetch histories'
      vi.spyOn(client, 'get').mockRejectedValueOnce(new Error(errorMessage))

      await expect(api.getHistories()).rejects.toThrow(errorMessage)
      expect(client.get).toHaveBeenCalledWith('/histories')
    })
  })

  describe('deleteModel', () => {
    it('successfully deletes a model', async () => {
      const modelId = 'test-model-123'
      const mockResponse = { success: true, message: 'Model deleted successfully' }
      vi.spyOn(client, 'delete').mockResolvedValueOnce({ data: mockResponse })

      const result = await api.deleteModel(modelId)

      expect(client.delete).toHaveBeenCalledWith(`/models?model_id=${modelId}`)
      expect(result).toEqual(mockResponse)
    })

    it('handles API error when deleting model', async () => {
      const modelId = 'test-model-123'
      const errorMessage = 'Model not found'
      vi.spyOn(client, 'delete').mockRejectedValueOnce(new Error(errorMessage))

      await expect(api.deleteModel(modelId)).rejects.toThrow(errorMessage)
      expect(client.delete).toHaveBeenCalledWith(`/models?model_id=${modelId}`)
    })

    it('calls the correct endpoint with URL encoded model ID', async () => {
      const modelId = 'org/model-name'
      const mockResponse = { success: true }
      vi.spyOn(client, 'delete').mockResolvedValueOnce({ data: mockResponse })

      await api.deleteModel(modelId)

      expect(client.delete).toHaveBeenCalledWith(`/models?model_id=${modelId}`)
    })

    it('handles server error response', async () => {
      const modelId = 'test-model'
      const serverError = { message: 'Internal server error', status: 500 }
      vi.spyOn(client, 'delete').mockRejectedValueOnce(serverError)

      await expect(api.deleteModel(modelId)).rejects.toEqual(serverError)
      expect(client.delete).toHaveBeenCalledWith(`/models?model_id=${modelId}`)
    })
  })
})
