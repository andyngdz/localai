import { dateFormatter } from '@/services'
import { HistoryItem } from '@/types'
import { Card } from '@heroui/react'
import Image from 'next/image'
import { FC } from 'react'
import { HistoryUseConfigButton } from './HistoryUseConfigButton'

interface HistoryItemProps {
  history: HistoryItem
}

export const HistoryItemContainer: FC<HistoryItemProps> = ({ history }) => {
  return (
    <Card className="flex flex-col gap-2 p-2">
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="text-default-500 font-bold">
            {dateFormatter.time(`${history.created_at}Z`)}
          </span>
          <HistoryUseConfigButton history={history} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-default-500 font-semibold truncate">
            {history.model}
          </span>
          <span className="truncate">{history.prompt}</span>
        </div>
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
    </Card>
  )
}
