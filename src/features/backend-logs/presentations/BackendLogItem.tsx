import { dateFormatter } from '@/services'
import { VirtualItem } from '@tanstack/react-virtual'
import { LogLevel } from '@types'
import clsx from 'clsx'
import { FC, Ref } from 'react'
import stripAnsi from 'strip-ansi'
import { backendLogsService } from '../services/backend-logs'

export interface BackendLogItemProps {
  virtualItem: VirtualItem
  measureElement: Ref<HTMLDivElement>
  timestamp: number
  level: LogLevel
  message: string
}

export const BackendLogItem: FC<BackendLogItemProps> = ({
  virtualItem,
  measureElement,
  timestamp,
  level,
  message
}) => {
  return (
    <div
      data-index={virtualItem.index}
      ref={measureElement}
      className="absolute w-full inset-x-0"
      style={{
        transform: `translateY(${virtualItem.start}px)`
      }}
    >
      <div className="flex gap-1 text-sm">
        <span className="shrink-0 min-w-10 text-default">
          {dateFormatter.timeFromTimestamp(timestamp)}
        </span>
        <span
          className={clsx(
            'wrap-break-word',
            backendLogsService.onGetLogColor(level)
          )}
        >
          {stripAnsi(message)}
        </span>
      </div>
    </div>
  )
}
