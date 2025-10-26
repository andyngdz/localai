import { DownloadStepProgressResponse } from '@/cores/sockets'
import { create } from 'zustand'

export interface UseDownloadWatcherStore {
  id?: string
  step?: DownloadStepProgressResponse

  onUpdateStep: (step: DownloadStepProgressResponse) => void
  onSetId: (id: string) => void
  onResetStep: VoidFunction
  onResetId: VoidFunction
}

export const useDownloadWatcherStore = create<UseDownloadWatcherStore>(
  (set) => ({
    onUpdateStep: (step) => set({ step }),
    onSetId: (id: string) => set({ id }),
    onResetStep: () => set({ step: undefined }),
    onResetId: () => set({ id: undefined })
  })
)
