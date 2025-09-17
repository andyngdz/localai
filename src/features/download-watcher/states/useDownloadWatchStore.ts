import { create } from 'zustand'

export interface UseDownloadWatcherStore {
  id: string
  percent: number
  isDownloading: boolean

  onUpdatePercent: (percent: number) => void
  onSetId: (id: string) => void
}

export const useDownloadWatcherStore = create<UseDownloadWatcherStore>((set, get) => ({
  id: '',
  percent: 0.0,
  isDownloading: get().id !== '',

  onUpdatePercent: (percent: number) => set({ percent }),
  onSetId: (id: string) => set({ id })
}))
