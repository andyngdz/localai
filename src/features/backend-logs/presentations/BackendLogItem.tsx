import { dateFormatter } from '@/services'
import { VirtualItem } from '@tanstack/react-virtual'
import clsx from 'clsx'
import { FC, Ref } from 'react'
import stripAnsi from 'strip-ansi'

export interface BackendLogItemProps {
  virtualItem: VirtualItem
  ref: Ref<HTMLDivElement>
  timestamp: number
  level: string
  message: string
}

export const BackendLogItem: FC<BackendLogItemProps> = ({
  virtualItem,
  ref,
  timestamp,
  level,
  message
}) => {
  return (
    <div
      data-index={virtualItem.index}
      ref={ref}
      className="absolute inset-x-0 w-full"
      style={{
        transform: `translateY(${virtualItem.start}px)`
      }}
    >
      <div className="flex gap-1 text-sm">
        <span className="shrink-0 min-w-10 text-default-700">
          {dateFormatter.timeFromTimestamp(timestamp)}
        </span>
        <span className={clsx(`wrap-break-word`, level)}>
          {stripAnsi(message)}
        </span>
      </div>
    </div>
  )
}
