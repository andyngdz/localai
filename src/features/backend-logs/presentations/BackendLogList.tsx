import { dateFormatter } from '@/services'
import { ScrollShadow } from '@heroui/react'
import { useMemo } from 'react'
import { useBackendLog } from '../states'

export const BackendLogList = () => {
  const { logs, onGetLogColor, scrollRef } = useBackendLog()

  const LogsComponent = useMemo(() => {
    return logs.map((log) => {
      const { timestamp, level } = log

      return (
        <div key={timestamp} className="flex gap-1 text-sm">
          <span className="flex-shrink-0 min-w-10 text-default-500">
            {dateFormatter.time(timestamp.toString())}
          </span>
          <span className={onGetLogColor(level)}>{log.message}</span>
        </div>
      )
    })
  }, [logs, onGetLogColor])

  return (
    <ScrollShadow
      ref={scrollRef}
      className="flex flex-col gap-1 scrollbar-thin"
    >
      {LogsComponent}
    </ScrollShadow>
  )
}
