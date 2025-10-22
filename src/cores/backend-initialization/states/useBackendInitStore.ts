import { create } from 'zustand'

interface BackendInitStore {
  isInitialized: boolean
  baseURL: string
  setInitialized: (initialized: boolean) => void
  setBaseURL: (url: string) => void
}

export const useBackendInitStore = create<BackendInitStore>((set) => ({
  isInitialized: false,
  baseURL: '',
  setInitialized: (initialized) => set({ isInitialized: initialized }),
  setBaseURL: (url) => set({ baseURL: url })
}))
