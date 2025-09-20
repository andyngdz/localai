import { create } from 'zustand'

export interface UseDownloadWatcherStore {
  id: string
  percent: number

  onUpdatePercent: (percent: number) => void
  onSetId: (id: string) => void
}

export const useDownloadWatcherStore = create<UseDownloadWatcherStore>(
  (set) => ({
    id: '',
    percent: 0.0,

    onUpdatePercent: (percent: number) => set({ percent }),
    onSetId: (id: string) => set({ id })
  })
)
