import axios from "axios";
import type {
  DeviceIndexResponse,
  HardwareResponse,
  HealthResponse,
  MaxMemoryRequest,
  MemoryResponse,
  ModelRecommendationResponse,
  SelectDeviceRequest,
} from "../types";

export const client = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

class API {
  async health() {
    const { data } = await client.get<HealthResponse>("/");

    return data;
  }

  async getHardwareStatus() {
    const { data } = await client.get<HardwareResponse>("/hardware/");

    return data;
  }

  async setMaxMemory(request: MaxMemoryRequest) {
    await client.post("/hardware/max-memory", request);
  }

  async getMemory() {
    const { data } = await client.get<MemoryResponse>("/hardware/memory");

    return data;
  }

  async selectDevice(request: SelectDeviceRequest) {
    await client.post("/hardware/device", request);
  }

  async getDeviceIndex() {
    const { data } = await client.get<DeviceIndexResponse>("/hardware/device");

    return data;
  }

  async getModelRecommendations() {
    const { data } = await client.get<ModelRecommendationResponse>("/models/recommendations");
    return data;
  }

  async downloadModel(id: string) {
    const { data } = await client.post("/downloads/", { id });

    return data;
  }
}

export const api = new API();
