import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api, client } from "../api";

// Mock axios
vi.mock("axios", () => {
  return {
    default: {
      create: () => ({
        get: vi.fn(),
        post: vi.fn(),
      }),
    },
  };
});

describe("API Service", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("health", () => {
    it("fetches health status", async () => {
      const mockResponse = { status: "ok", message: "Server is healthy" };
      vi.spyOn(client, "get").mockResolvedValueOnce({ data: mockResponse });

      const result = await api.health();

      expect(client.get).toHaveBeenCalledWith("/");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getHardwareStatus", () => {
    it("fetches hardware status", async () => {
      const mockResponse = {
        is_cuda: true,
        cuda_runtime_version: "11.8",
        nvidia_driver_version: "520.61.05",
        gpus: [
          {
            name: "NVIDIA GeForce RTX 3090",
            memory: 24576,
            cuda_compute_capability: "8.6",
            is_primary: true,
          },
        ],
        message: "CUDA is available",
      };
      vi.spyOn(client, "get").mockResolvedValueOnce({ data: mockResponse });

      const result = await api.getHardwareStatus();

      expect(client.get).toHaveBeenCalledWith("/hardware/");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("setMaxMemory", () => {
    it("sends max memory configuration", async () => {
      const request = { gpu_scale_factor: 0.7, ram_scale_factor: 0.7 };
      vi.spyOn(client, "post").mockResolvedValueOnce({});

      await api.setMaxMemory(request);

      expect(client.post).toHaveBeenCalledWith("/hardware/max-memory", request);
    });
  });

  describe("getMemory", () => {
    it("fetches memory information", async () => {
      const mockResponse = { gpu: 24576000000, ram: 32000000000 };
      vi.spyOn(client, "get").mockResolvedValueOnce({ data: mockResponse });

      const result = await api.getMemory();

      expect(client.get).toHaveBeenCalledWith("/hardware/memory");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("selectDevice", () => {
    it("selects a device", async () => {
      const request = { device_index: 0 };
      vi.spyOn(client, "post").mockResolvedValueOnce({});

      await api.selectDevice(request);

      expect(client.post).toHaveBeenCalledWith("/hardware/device", request);
    });
  });

  describe("getDeviceIndex", () => {
    it("fetches device index", async () => {
      const mockResponse = { device_index: 1 };
      vi.spyOn(client, "get").mockResolvedValueOnce({ data: mockResponse });

      const result = await api.getDeviceIndex();

      expect(client.get).toHaveBeenCalledWith("/hardware/device");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getModelRecommendations", () => {
    it("fetches model recommendations", async () => {
      const mockResponse = {
        sections: [
          {
            id: "section1",
            name: "Section 1",
            description: "Test section",
            models: [
              {
                id: "model1",
                name: "Model 1",
                description: "Test model",
                memory_requirement_gb: 4,
                model_size: "Medium",
                tags: ["tag1", "tag2"],
                is_recommended: true,
              },
            ],
            is_recommended: true,
          },
        ],
        default_section: "section1",
        default_selected_id: "model1",
      };
      vi.spyOn(client, "get").mockResolvedValueOnce({ data: mockResponse });

      const result = await api.getModelRecommendations();

      expect(client.get).toHaveBeenCalledWith("/models/recommendations");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("downloadModel", () => {
    it("initiates model download", async () => {
      const mockResponse = { status: "downloading" };
      vi.spyOn(client, "post").mockResolvedValueOnce({ data: mockResponse });
      const modelId = "model1";

      const result = await api.downloadModel(modelId);

      expect(client.post).toHaveBeenCalledWith("/downloads/", { id: modelId });
      expect(result).toEqual(mockResponse);
    });
  });
});
