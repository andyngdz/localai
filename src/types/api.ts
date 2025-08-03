export interface HealthResponse {
  status: string;
  message: string;
}

export interface GpuInfo {
  name: string;
  memory: number;
  cuda_compute_capability: string;
  is_primary: boolean;
}

export interface HardwareResponse {
  is_cuda: boolean;
  cuda_runtime_version: string;
  nvidia_driver_version: string;
  gpus: GpuInfo[];
  message: string;
}

export interface DeviceIndexResponse {
  device_index: number;
}

export interface MemoryResponse {
  gpu: number;
  ram: number;
}

export interface SelectDeviceRequest {
  device_index: number;
}

export interface MaxMemoryRequest {
  gpu_scale_factor: number;
  ram_scale_factor: number;
}

export interface ApiError {
  message: string;
  status?: number;
}
