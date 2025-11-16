import { create } from 'zustand'

interface WindowState {
  isMaximized: boolean
  setIsMaximized: (isMaximized: boolean) => void
}

export const useWindowStore = create<WindowState>((set) => ({
  isMaximized: false,
  setIsMaximized: (isMaximized: boolean) => set({ isMaximized })
}))
