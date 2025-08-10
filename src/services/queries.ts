import { useQuery } from "@tanstack/react-query";
import {
  ApiError,
  HardwareResponse,
  HealthResponse,
  MemoryResponse,
  ModelDownloaded,
  ModelRecommendationResponse,
} from "../types/api";
import { api } from "./api";

const useHealthQuery = () => {
  return useQuery<HealthResponse, ApiError>({
    queryKey: ["health"],
    queryFn: api.health,
    refetchInterval: 3000,
  });
};

const useHardwareQuery = () => {
  return useQuery<HardwareResponse, ApiError>({
    queryKey: ["hardware"],
    queryFn: () => api.getHardwareStatus(),
  });
};

const useMemoryQuery = () => {
  return useQuery<MemoryResponse, ApiError>({
    queryKey: ["memory"],
    queryFn: () => api.getMemory(),
  });
};

const useModelRecommendationsQuery = () => {
  return useQuery<ModelRecommendationResponse, ApiError>({
    queryKey: ["model-recommendations"],
    queryFn: () => api.getModelRecommendations(),
  });
};

const useDownloadedModels = () => {
  return useQuery<ModelDownloaded[], ApiError>({
    queryKey: ["downloaded-models"],
    queryFn: () => api.getDownloadedModels(),
  });
};

export {
  useDownloadedModels,
  useHardwareQuery,
  useHealthQuery,
  useMemoryQuery,
  useModelRecommendationsQuery,
};
