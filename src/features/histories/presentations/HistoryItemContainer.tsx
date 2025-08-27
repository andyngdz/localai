import Image from 'next/image'
import { ImageGenerationItem } from '@/types/image-generations'
import { useMemo } from 'react'
import { HistoryItem } from '@/types'

interface HistoryItemProps {
  history: HistoryItem
  images?: ImageGenerationItem[]
}

export function HistoryItemContainer({ history, images = [] }: HistoryItemProps) {
  const formattedTime = useMemo(() => {
    const date = new Date(history.created_at)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }, [history.created_at])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{formattedTime}</h3>
        <p className="text-sm text-gray-500">{history.model}</p>
      </div>

      <p className="text-sm truncate">{history.prompt}</p>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {images.map((image, index) => (
            <div
              key={`${image.file_name}-${index}`}
              className="relative w-12 h-12 overflow-hidden rounded-md"
            >
              <Image
                src={`/static/${image.path}`}
                alt={`Generated image ${index + 1}`}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
