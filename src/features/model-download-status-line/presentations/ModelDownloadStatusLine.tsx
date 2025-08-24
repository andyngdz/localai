import { Divider, Skeleton } from '@heroui/react'
import { useModelDownloadStatusLine } from '../states'
import { useMemo } from 'react'

export const ModelDownloadStatusLine = () => {
  const { percent } = useModelDownloadStatusLine()

  const Indicator = useMemo(() => {
    if (percent <= 0) return

    return (
      <div className="ml-0.5 mr-0.5 absolute flex flex-col h-1 inset-0">
        <Skeleton className="h-full w-full absolute" />
        <div
          className={'h-full absolute bg-primary transition-all duration-500 ease-in-out'}
          style={{ width: `${percent * 100}%` }}
        />
      </div>
    )
  }, [percent])

  return (
    <div className="relative">
      <Divider className="h-1" />
      {Indicator}
    </div>
  )
}
