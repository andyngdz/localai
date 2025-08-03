import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import type {
  HealthResponse,
  HardwareResponse,
  DeviceIndexResponse,
  SelectDeviceRequest,
  ApiError,
} from "../types/api";

export const useHealthQuery = () => {
  return useQuery<HealthResponse, ApiError>({
    queryKey: ["health"],
    queryFn: () => api.health(),
    retry: 3,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchInterval: 30000,
    staleTime: 10000,
  });
};

export const useHardwareQuery = () => {
  return useQuery<HardwareResponse, ApiError>({
    queryKey: ["hardware"],
    queryFn: () => api.getHardwareStatus(),
    retry: 2,
    staleTime: 60000,
  });
};

export const useDeviceIndexQuery = () => {
  return useQuery<DeviceIndexResponse, ApiError>({
    queryKey: ["device-index"],
    queryFn: () => api.getDeviceIndex(),
    retry: 2,
  });
};

export const useSelectDeviceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, SelectDeviceRequest>({
    mutationFn: (request: SelectDeviceRequest) => api.selectDevice(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["device-index"] });
    },
  });
};
