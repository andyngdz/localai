import { ScrollShadow } from '@heroui/react'
import { useBackendLog } from '../states'
import { BackendLogItem } from './BackendLogItem'

export const BackendLogList = () => {
  const { logs, scrollRef, rowVirtualizer } = useBackendLog()
  const virtualItems = rowVirtualizer.getVirtualItems()

  return (
    <ScrollShadow ref={scrollRef}>
      <div
        className="relative"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {virtualItems.map((virtualItem) => {
          const log = logs[virtualItem.index]

          return (
            <BackendLogItem
              key={virtualItem.key}
              virtualItem={virtualItem}
              data-index={virtualItem.index}
              log={log}
              ref={rowVirtualizer.measureElement}
            />
          )
        })}
      </div>
    </ScrollShadow>
  )
}
