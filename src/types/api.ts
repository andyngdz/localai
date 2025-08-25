export interface HealthResponse {
  status: string
  message: string
}

export interface GpuInfo {
  name: string
  memory: number
  cuda_compute_capability: string
  is_primary: boolean
}

export interface HardwareResponse {
  is_cuda: boolean
  cuda_runtime_version: string
  nvidia_driver_version: string
  gpus: GpuInfo[]
  message: string
}

export interface DeviceIndexResponse {
  device_index: number
}

export interface MemoryResponse {
  gpu: number
  ram: number
}

export interface SelectDeviceRequest {
  device_index: number
}

export interface MaxMemoryRequest {
  gpu_scale_factor: number
  ram_scale_factor: number
}

export interface ModelRecommendationItem {
  id: string
  name: string
  description: string
  memory_requirement_gb: number
  model_size: string
  tags: string[]
  is_recommended: boolean
}

export interface ModelRecommendationSection {
  id: string
  name: string
  description: string
  models: ModelRecommendationItem[]
  is_recommended: boolean
}

export interface ModelRecommendationResponse {
  sections: ModelRecommendationSection[]
  default_section: string
  default_selected_id: string
}

export interface ModelDownloaded {
  created_at: string
  id: number
  model_id: string
  model_dir: string
  updated_at: string
}

export interface StyleItem {
  id: string
  name: string
  origin: string
  license: string
  positive: string
  negative?: string
  image: string
}

export interface StyleSection {
  id: string
  styles: StyleItem[]
}

export interface ApiError {
  message: string
  status?: number
}
