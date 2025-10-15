'use client'

import {
  useDownloadWatcher,
  useDownloadWatcherStore
} from '@/features/download-watcher'
import { api, formatter } from '@/services'
import { Button } from '@heroui/react'
import clsx from 'clsx'
import { Download } from 'lucide-react'
import { FC } from 'react'

interface ModelRecommendationsDownloadButtonProps {
  modelId: string
}

export const ModelRecommendationsDownloadButton: FC<
  ModelRecommendationsDownloadButtonProps
> = ({ modelId }) => {
  const { id } = useDownloadWatcherStore()
  const { percent, isDownloading, downloadSized, downloadTotalSized } =
    useDownloadWatcher(modelId)
  const isDisabled = isDownloading || (!!id && modelId !== id)

  const onDownload = async () => {
    await api.downloadModel(modelId)
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      {isDownloading && (
        <div
          className="absolute inset-0 bg-primary/30 transition-all duration-300"
          style={{ width: `${percent * 100}%` }}
        />
      )}
      <Button
        color={isDownloading ? 'primary' : 'default'}
        isDisabled={isDisabled}
        onPress={onDownload}
        startContent={!isDownloading && <Download size={16} />}
        className="w-full relative z-10"
        variant={isDownloading ? 'bordered' : 'solid'}
        size="sm"
      >
        <span
          className={clsx('font-semibold', {
            'animate-pulse': isDownloading,
            'text-foreground': isDownloading
          })}
        >
          {isDownloading
            ? `${formatter.bytes(downloadSized)} / ${formatter.bytes(
                downloadTotalSized
              )}`
            : 'Download Model'}
        </span>
      </Button>
    </div>
  )
}
