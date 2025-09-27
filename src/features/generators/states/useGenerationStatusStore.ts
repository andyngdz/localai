import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export interface GenerationStatusStore {
  isGenerating: boolean
  onSetIsGenerating: (status: boolean) => void
  reset: () => void
}

export const useGenerationStatusStore = create<GenerationStatusStore>()(
  immer((set, _get, store) => ({
    isGenerating: false,
    onSetIsGenerating: (status: boolean) => {
      set((state) => {
        state.isGenerating = status
      })
    },
    reset: () => set(store.getInitialState())
  }))
)
