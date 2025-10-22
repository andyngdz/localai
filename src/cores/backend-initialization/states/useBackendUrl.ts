import { DEFAULT_BACKEND_URL } from '@/cores/constants'
import { useBackendInitStore } from './useBackendInitStore'

export const useBackendUrl = () => {
  const baseURL = useBackendInitStore((state) => state.baseURL)
  return baseURL || DEFAULT_BACKEND_URL
}
