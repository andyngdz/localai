import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ModelSelectorState {
  selected_model_id: string
  setSelectedModelId: (id: string) => void
}

export const useModelSelectorStore = create(
  persist<ModelSelectorState>(
    (set) => ({
      selected_model_id: '',
      setSelectedModelId: (selected_model_id) => set({ selected_model_id })
    }),
    {
      name: 'model-selector'
    }
  )
)
