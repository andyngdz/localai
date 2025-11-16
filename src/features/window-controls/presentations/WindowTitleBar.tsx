'use client'

import { DRAG_REGION_CLASS, TITLE_BAR_HEIGHT } from '../constants'
import { useWindowMaximizedListener } from '../states/useWindowMaximizedListener'
import { WindowControlButtons } from './WindowControlButtons'

interface WindowTitleBarProps {
  currentSection?: string
}

export const WindowTitleBar = ({ currentSection }: WindowTitleBarProps) => {
  useWindowMaximizedListener()

  return (
    <div
      className={`flex items-center justify-between px-4 bg-background/80 backdrop-blur-md border-b border-divider ${DRAG_REGION_CLASS}`}
      style={{ height: `${TITLE_BAR_HEIGHT}px` }}
    >
      <div className="flex-1">
        {currentSection && (
          <span className="text-sm text-default-600">{currentSection}</span>
        )}
      </div>
      <WindowControlButtons />
    </div>
  )
}
