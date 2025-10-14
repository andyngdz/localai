import { useDownloadWatcher } from '@/features/download-watcher'
import { Skeleton } from '@heroui/react'
import { FC } from 'react'

export interface ModelDownloadStatusLineIndicatorProps {
  id: string
}

export const ModelDownloadStatusLineIndicator: FC<
  ModelDownloadStatusLineIndicatorProps
> = ({ id }) => {
  const { percent } = useDownloadWatcher(id)

  if (percent <= 0) return null

  return (
    <div className="ml-0.5 mr-0.5 absolute flex flex-col h-1 inset-0">
      <Skeleton className="h-full w-full absolute" />
      <div
        className={
          'h-full absolute bg-primary transition-all duration-500 ease-in-out'
        }
        style={{ width: `${percent * 100}%` }}
      />
    </div>
  )
}
