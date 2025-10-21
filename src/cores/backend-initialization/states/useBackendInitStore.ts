import { create } from 'zustand'

interface BackendInitStore {
  isInitialized: boolean
  setInitialized: (initialized: boolean) => void
}

export const useBackendInitStore = create<BackendInitStore>((set) => ({
  isInitialized: false,
  setInitialized: (initialized) => set({ isInitialized: initialized })
}))
