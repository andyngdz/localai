import axios from "axios";
import type {
  HardwareResponse,
  HealthResponse,
  MaxMemoryRequest,
  MemoryResponse,
  SelectDeviceRequest,
} from "../types/api";

export const client = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = {
      message:
        error.response?.data?.message || error.message || "Network error",
      status: error.response?.status,
    };
    return Promise.reject(apiError);
  }
);

class API {
  async health(): Promise<HealthResponse> {
    const { data } = await client.get("/");

    return data;
  }

  async getHardwareStatus(): Promise<HardwareResponse> {
    const { data } = await client.get("/hardware/");

    return data;
  }

  async setMaxMemory(request: MaxMemoryRequest): Promise<void> {
    await client.post("/hardware/max-memory", request);
  }

  async getMemory(): Promise<MemoryResponse> {
    const { data } = await client.get("/hardware/memory");

    return data;
  }

  async selectDevice(request: SelectDeviceRequest): Promise<void> {
    await client.post("/hardware/device", request);
  }
}

export const api = new API();
