import { DEFAULT_BACKEND_URL } from '@/cores/constants'
import { GeneratorConfigFormValues } from '@/features/generator-configs'
import axios from 'axios'
import type {
  DeviceIndexResponse,
  HardwareResponse,
  HealthResponse,
  HistoryItem,
  ImageGenerationRequest,
  ImageGenerationResponse,
  LoadModelRequest,
  MaxMemoryRequest,
  MemoryResponse,
  ModelDetailsResponse,
  ModelDownloaded,
  ModelRecommendationResponse,
  ModelSearchResponse,
  SelectDeviceRequest,
  StyleSection
} from '../types'

export const client = axios.create({
  baseURL: DEFAULT_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

class API {
  async health() {
    const { data } = await client.get<HealthResponse>('/')

    return data
  }

  async getHardwareStatus() {
    const { data } = await client.get<HardwareResponse>('/hardware/')

    return data
  }

  async setMaxMemory(request: MaxMemoryRequest) {
    await client.post('/hardware/max-memory', request)
  }

  async getMemory() {
    const { data } = await client.get<MemoryResponse>('/hardware/memory')

    return data
  }

  async selectDevice(request: SelectDeviceRequest) {
    await client.post('/hardware/device', request)
  }

  async getDeviceIndex() {
    const { data } = await client.get<DeviceIndexResponse>('/hardware/device')

    return data
  }

  async getModelRecommendations() {
    const { data } = await client.get<ModelRecommendationResponse>(
      '/models/recommendations'
    )

    return data
  }

  async loadModel(request: LoadModelRequest) {
    const { data } = await client.post('/models/load', request)

    return data
  }

  async unloadModel() {
    const { data } = await client.get('/models/unload')

    return data
  }

  async searchModel(model_name: string) {
    const { data } = await client.get<ModelSearchResponse>(
      `/models/search?model_name=${model_name}`
    )

    return data
  }

  async modelDetails(model_id: string) {
    const { data } = await client.get<ModelDetailsResponse>(
      `/models/details?id=${model_id}`
    )

    return data
  }

  async downloadModel(id: string) {
    await client.post('/downloads/', { id })
  }

  async getDownloadedModels() {
    const { data } = await client.get<ModelDownloaded[]>('/models/downloaded')

    return data
  }

  async addHistory(config: GeneratorConfigFormValues) {
    const { data } = await client.post<number>('/histories', config)

    return data
  }

  async generator(request: ImageGenerationRequest) {
    const { data } = await client.post<ImageGenerationResponse>(
      `/generators`,
      request
    )

    return data
  }

  async styles() {
    const { data } = await client.get<StyleSection[]>('/styles')

    return data
  }

  async getHistories() {
    const { data } = await client.get<HistoryItem[]>('/histories')

    return data
  }

  async deleteModel(model_id: string) {
    const { data } = await client.delete(`/models?model_id=${model_id}`)

    return data
  }
}

export const api = new API()
