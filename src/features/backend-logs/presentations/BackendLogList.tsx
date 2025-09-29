import { dateFormatter } from '@/services'
import { ScrollShadow } from '@heroui/react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useMemo } from 'react'
import { useBackendLog } from '../states'

export const BackendLogList = () => {
  const { logs, onGetLogColor, scrollRef } = useBackendLog()

  const rowVirtualizer = useVirtualizer({
    count: logs.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 40
  })

  const LogsComponent = useMemo(() => {
    return rowVirtualizer.getVirtualItems().map((virtualItem) => {
      const log = logs[virtualItem.index]
      const { timestamp, level } = log

      return (
        <div
          key={virtualItem.key}
          className="absolute inset-0 w-full"
          style={{
            height: `${virtualItem.size}px`,
            transform: `translateY(${virtualItem.start}px)`
          }}
        >
          <div className="flex gap-1 text-sm">
            <span className="flex-shrink-0 min-w-10 text-default-500">
              {dateFormatter.time(timestamp.toString())}
            </span>
            <span className={onGetLogColor(level)}>{log.message}</span>
          </div>
        </div>
      )
    })
  }, [logs, onGetLogColor, rowVirtualizer])

  return (
    <ScrollShadow ref={scrollRef} className="scrollbar-thin h-96">
      <div
        className="relative w-full"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {LogsComponent}
      </div>
    </ScrollShadow>
  )
}
