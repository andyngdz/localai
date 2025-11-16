import { useEffect } from 'react'
import { create } from 'zustand'

interface WindowState {
  isMaximized: boolean
  setIsMaximized: (isMaximized: boolean) => void
}

export const useWindowState = create<WindowState>((set) => ({
  isMaximized: false,
  setIsMaximized: (isMaximized: boolean) => set({ isMaximized })
}))

export const useWindowMaximizedListener = () => {
  const setIsMaximized = useWindowState((state) => state.setIsMaximized)

  useEffect(() => {
    if (!window.electronAPI) return

    window.electronAPI.window
      .isMaximized()
      .then(setIsMaximized)
      .catch(console.error)

    const unsubscribe =
      window.electronAPI.window.onMaximizedChange(setIsMaximized)

    return unsubscribe
  }, [setIsMaximized])
}
