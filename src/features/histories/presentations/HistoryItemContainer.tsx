import Image from 'next/image'
import { FC, useMemo } from 'react'
import { HistoryItem } from '@/types'

interface HistoryItemProps {
  history: HistoryItem
}

export const HistoryItemContainer: FC<HistoryItemProps> = ({ history }) => {
  const formattedTime = useMemo(() => {
    const date = new Date(history.created_at)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }, [history.created_at])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 text-sm">
        <span className="text-default-500 font-bold">{formattedTime}</span>
        <span className="text-default-500 font-semibold">{history.model}</span>
        <span className="truncate">{history.prompt}</span>
      </div>
      {history.generated_images.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {history.generated_images.map((image, index) => (
            <div
              key={`${image.file_name}-${index}`}
              className="relative w-12 h-12 overflow-hidden rounded-md"
            >
              <Image
                src={`http://localhost:8000/${image.path}`}
                alt={`Generated image ${index + 1}`}
                className="object-cover"
                sizes="48px"
                fill
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
