import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  ApiError,
  HardwareResponse,
  HealthResponse,
  MemoryResponse,
  ModelRecommendationResponse,
} from "../types/api";
import { api } from "./api";

export const useHealthQuery = () => {
  return useQuery<HealthResponse, ApiError>({
    queryKey: ["health"],
    queryFn: () => api.health(),
    refetchInterval: 10000,
    staleTime: 10000,
  });
};

export const useHardwareQuery = () => {
  return useQuery<HardwareResponse, ApiError>({
    queryKey: ["hardware"],
    queryFn: () => api.getHardwareStatus(),
  });
};

export const useMemoryQuery = () => {
  return useQuery<MemoryResponse, ApiError>({
    queryKey: ["memory"],
    queryFn: () => api.getMemory(),
  });
};

export const useModelRecommendationsQuery = () => {
  return useQuery<ModelRecommendationResponse, ApiError>({
    queryKey: ["model-recommendations"],
    queryFn: () => api.getModelRecommendations(),
  });
};

export const useDownloadModelMutation = () => {
  return useMutation({
    mutationFn: (modelId: string) => api.downloadModel(modelId),
  });
};
