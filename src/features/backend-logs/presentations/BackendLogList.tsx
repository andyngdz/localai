import { dateFormatter } from '@/services'
import { ScrollShadow } from '@heroui/react'
import { useMemo } from 'react'
import { useBackendLog } from '../states'

export const BackendLogList = () => {
  const { logs } = useBackendLog()

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-danger'
      case 'warn':
        return 'text-warning'
      case 'info':
        return 'text-info'
      case 'log':
      default:
        return 'text-default-700'
    }
  }

  const LogsComponent = useMemo(() => {
    return logs.map((log) => {
      return (
        <div key={log.timestamp} className="flex gap-1 text-sm">
          <span className="flex-shrink-0 min-w-10 text-default-500">
            {dateFormatter.time(log.timestamp.toString())}
          </span>
          <span className={getLogColor(log.level)}>{log.message}</span>
        </div>
      )
    })
  }, [logs])

  return (
    <ScrollShadow className="flex flex-col gap-1 scrollbar-thin">
      {LogsComponent}
    </ScrollShadow>
  )
}
