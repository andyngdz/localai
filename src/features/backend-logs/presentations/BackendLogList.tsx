import { ScrollShadow } from '@heroui/react'
import { useMemo } from 'react'
import { useBackendLog } from '../states'
import { BackendLogItem } from './BackendLogItem'

export const BackendLogList = () => {
  const { logs, onGetLogColor, scrollRef, rowVirtualizer } = useBackendLog()

  const LogsComponent = useMemo(() => {
    return rowVirtualizer.getVirtualItems().map((virtualItem) => {
      const log = logs[virtualItem.index]
      const { timestamp, level, message } = log

      return (
        <BackendLogItem
          key={virtualItem.key}
          data-index={virtualItem.index}
          virtualItem={virtualItem}
          timestamp={timestamp}
          level={onGetLogColor(level)}
          message={message}
          ref={rowVirtualizer.measureElement}
        />
      )
    })
  }, [logs, onGetLogColor, rowVirtualizer])

  return (
    <ScrollShadow ref={scrollRef}>
      <div
        className="relative w-full"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {LogsComponent}
      </div>
    </ScrollShadow>
  )
}
