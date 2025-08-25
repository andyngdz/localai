import { Button } from '@heroui/react'
import { FC } from 'react'
import { useDownloadButton } from '../states'
import { useDownloadWatcher } from '@/features/download-watcher'
import { useDownloadedModels } from '@/cores/hooks'

export interface ModelSearchViewDownloadButtonProps {
  id: string
}

export const ModelSearchViewDownloadButton: FC<ModelSearchViewDownloadButtonProps> = ({ id }) => {
  const { onDownload } = useDownloadButton(id)
  const { isDownloading } = useDownloadWatcher(id)
  const { onCheckDownloaded } = useDownloadedModels()
  const isDownloaded = onCheckDownloaded(id)

  return (
    <Button
      color="primary"
      className="text-background"
      onPress={onDownload}
      isLoading={isDownloading}
    >
      Download this model
    </Button>
  )
}
