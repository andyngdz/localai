import { ScrollShadow } from '@heroui/react'
import { useBackendLog } from '../states'
import { BackendLogItem } from './BackendLogItem'

export const BackendLogList = () => {
  const { logs, scrollRef, rowVirtualizer } = useBackendLog()
  const virtualItems = rowVirtualizer.getVirtualItems()

  return (
    <ScrollShadow ref={scrollRef}>
      <div
        className="relative w-full"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {virtualItems.map((virtualItem) => {
          const log = logs[virtualItem.index]

          return (
            <div
              key={virtualItem.key}
              ref={rowVirtualizer.measureElement}
              className="absolute inset-x-0 w-full"
              style={{
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`
              }}
            >
              <BackendLogItem log={log} />
            </div>
          )
        })}
      </div>
    </ScrollShadow>
  )
}
