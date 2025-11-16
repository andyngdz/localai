import { useEffect } from 'react'
import { useWindowStore } from './useWindowStore'

export const useWindowMaximizedListener = () => {
  const setIsMaximized = useWindowStore((state) => state.setIsMaximized)

  useEffect(() => {
    window.electronAPI.window
      .isMaximized()
      .then(setIsMaximized)
      .catch(console.error)

    const unsubscribe =
      window.electronAPI.window.onMaximizedChange(setIsMaximized)

    return unsubscribe
  }, [setIsMaximized])
}
