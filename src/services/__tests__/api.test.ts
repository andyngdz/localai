import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { api, client } from '../api'

// Mock axios
vi.mock('axios', () => {
  return {
    default: {
      create: () => ({
        get: vi.fn(),
        post: vi.fn()
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
})
