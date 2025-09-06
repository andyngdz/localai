import { create } from 'zustand'

export type ImageViewMode = 'grid' | 'slider'

interface ImageViewModeStore {
  viewMode: ImageViewMode
  setViewMode: (mode: ImageViewMode) => void
}

export const useImageViewModeStore = create<ImageViewModeStore>((set) => ({
  viewMode: 'grid',
  setViewMode: (mode) => set({ viewMode: mode })
}))
