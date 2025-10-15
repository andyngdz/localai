import { useDownloadWatcher } from '@/features/download-watcher'
import { formatter } from '@/services'
import { FC } from 'react'

export interface ModelDownloadStatusInfoProps {
  id: string
}

export const ModelDownloadStatusInfo: FC<ModelDownloadStatusInfoProps> = ({
  id
}) => {
  const { downloadSized, downloadTotalSized, currentFile } =
    useDownloadWatcher(id)

  if (downloadTotalSized <= 0) return null

  return (
    <div className="flex justify-between items-center px-4">
      <span className="text-xs text-default-700 font-medium">
        {currentFile}
      </span>
      <span className="text-xs text-default-700 font-medium">
        <span>{formatter.bytes(downloadSized)}</span>
        <span> / </span>
        <span>{formatter.bytes(downloadTotalSized)}</span>
      </span>
    </div>
  )
}
