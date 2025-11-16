'use client'

import { Button } from '@heroui/react'
import { Minus, Square, X } from 'lucide-react'
import { NO_DRAG_CLASS } from '../constants'
import { useWindowStore } from '../states/useWindowStore'

export const WindowControlButtons = () => {
  const isMaximized = useWindowStore((state) => state.isMaximized)

  const handleMinimize = () => {
    window.electronAPI.window.minimize().catch(console.error)
  }

  const handleToggleMaximize = () => {
    if (isMaximized) {
      window.electronAPI.window.unmaximize().catch(console.error)
    } else {
      window.electronAPI.window.maximize().catch(console.error)
    }
  }

  const handleClose = () => {
    window.electronAPI.window.close().catch(console.error)
  }

  return (
    <div className={`flex items-center gap-1 ${NO_DRAG_CLASS}`}>
      <Button
        isIconOnly
        variant="light"
        size="sm"
        onPress={handleMinimize}
        aria-label="Minimize window"
        className="hover:bg-default-200"
      >
        <Minus size={16} />
      </Button>
      <Button
        isIconOnly
        variant="light"
        size="sm"
        onPress={handleToggleMaximize}
        aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
        className="hover:bg-default-200"
      >
        <Square size={14} />
      </Button>
      <Button
        isIconOnly
        variant="light"
        size="sm"
        onPress={handleClose}
        aria-label="Close window"
        className="hover:bg-danger-100 hover:text-danger"
      >
        <X size={16} />
      </Button>
    </div>
  )
}
