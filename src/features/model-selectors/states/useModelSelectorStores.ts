import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ModelSelectorState {
  id: string;
  setId: (id: string) => void;
}

export const useModelSelectorStore = create(
  persist<ModelSelectorState>(
    (set) => ({
      id: '',
      setId: (id) => set({ id }),
    }),
    {
      name: 'model-selector',
    },
  ),
);
