import { useQuery } from '@tanstack/react-query'
import {
  ApiError,
  HardwareResponse,
  HealthResponse,
  MemoryResponse,
  ModelDownloaded,
  ModelRecommendationResponse,
  StyleSection
} from '../types/api'
import { api } from './api'
import { HistoryItem } from '@/types'

const useHealthQuery = () => {
  return useQuery<HealthResponse, ApiError>({
    queryKey: ['health'],
    queryFn: () => api.health(),
    refetchInterval: 3000
  })
}

const useHardwareQuery = () => {
  return useQuery<HardwareResponse, ApiError>({
    queryKey: ['getHardwareStatus'],
    queryFn: () => api.getHardwareStatus()
  })
}

const useMemoryQuery = () => {
  return useQuery<MemoryResponse, ApiError>({
    queryKey: ['getMemory'],
    queryFn: () => api.getMemory()
  })
}

const useModelRecommendationsQuery = () => {
  return useQuery<ModelRecommendationResponse, ApiError>({
    queryKey: ['getModelRecommendations'],
    queryFn: () => api.getModelRecommendations()
  })
}

const useDownloadedModelsQuery = () => {
  return useQuery<ModelDownloaded[], ApiError>({
    queryKey: ['getDownloadedModels'],
    queryFn: () => api.getDownloadedModels()
  })
}

const useStyleSectionsQuery = () => {
  return useQuery<StyleSection[], ApiError>({
    queryKey: ['styles'],
    queryFn: () => api.styles()
  })
}

const useHistoriesQuery = () => {
  return useQuery<HistoryItem[], ApiError>({
    queryKey: ['getHistories'],
    queryFn: () => api.getHistories()
  })
}

export {
  useDownloadedModelsQuery,
  useHardwareQuery,
  useHealthQuery,
  useHistoriesQuery,
  useMemoryQuery,
  useModelRecommendationsQuery,
  useStyleSectionsQuery
}
