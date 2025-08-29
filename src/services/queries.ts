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
    queryKey: ['hardware'],
    queryFn: () => api.getHardwareStatus()
  })
}

const useMemoryQuery = () => {
  return useQuery<MemoryResponse, ApiError>({
    queryKey: ['memory'],
    queryFn: () => api.getMemory()
  })
}

const useModelRecommendationsQuery = () => {
  return useQuery<ModelRecommendationResponse, ApiError>({
    queryKey: ['model-recommendations'],
    queryFn: () => api.getModelRecommendations()
  })
}

const useDownloadedModelsQuery = () => {
  return useQuery<ModelDownloaded[], ApiError>({
    queryKey: ['downloaded-models'],
    queryFn: () => api.getDownloadedModels()
  })
}

const useStyleSectionsQuery = () => {
  return useQuery<StyleSection[], ApiError>({
    queryKey: ['style-section'],
    queryFn: () => api.styles()
  })
}

const useHistoriesQuery = () => {
  return useQuery<HistoryItem[], ApiError>({
    queryKey: ['histories'],
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
