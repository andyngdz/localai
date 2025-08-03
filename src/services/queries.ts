import { useQuery } from "@tanstack/react-query";
import type { ApiError, HardwareResponse, HealthResponse } from "../types/api";
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
