'use client'

import { useBackendUrl } from '@/cores/backend-initialization'
import { dateFormatter } from '@/services'
import { HistoryItem } from '@/types'
import { ScrollShadow } from '@heroui/react'
import Image from 'next/image'
import { FC } from 'react'
import { HistoryPhotoviewConfigRow } from './HistoryPhotoviewConfigRow'

interface HistoryPhotoviewCardProps {
  history: HistoryItem
}

export const HistoryPhotoviewCard: FC<HistoryPhotoviewCardProps> = ({
  history
}) => {
  const baseURL = useBackendUrl()

  return (
    <ScrollShadow className="h-full w-full">
      <div className="flex flex-col w-full max-w-4xl mx-auto p-6 gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-default-900">
            {dateFormatter.time(`${history.created_at}Z`)}
          </h2>
          <p className="text-lg text-default-600">{history.model}</p>
        </div>

        {history.generated_images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {history.generated_images.map((image, index) => (
              <div
                key={`${image.file_name}-${index}`}
                className="relative aspect-square overflow-hidden rounded-lg"
              >
                <Image
                  src={`${baseURL}/${image.path}`}
                  alt={`Generated image ${index + 1}`}
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  fill
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-default-900 mb-2">
            Configuration
          </h3>
          <HistoryPhotoviewConfigRow
            label="Prompt"
            value={history.config.prompt}
          />
          <HistoryPhotoviewConfigRow
            label="Negative Prompt"
            value={history.config.negative_prompt || 'None'}
          />
          <HistoryPhotoviewConfigRow label="Model" value={history.model} />
          <HistoryPhotoviewConfigRow
            label="Width"
            value={history.config.width}
          />
          <HistoryPhotoviewConfigRow
            label="Height"
            value={history.config.height}
          />
          <HistoryPhotoviewConfigRow
            label="Steps"
            value={history.config.steps}
          />
          <HistoryPhotoviewConfigRow
            label="CFG Scale"
            value={history.config.cfg_scale}
          />
          <HistoryPhotoviewConfigRow
            label="Sampler"
            value={history.config.sampler}
          />
          <HistoryPhotoviewConfigRow
            label="Seed"
            value={history.config.seed === -1 ? 'Random' : history.config.seed}
          />
          <HistoryPhotoviewConfigRow
            label="Number of Images"
            value={history.config.number_of_images}
          />
          <HistoryPhotoviewConfigRow
            label="Hires Fix"
            value={history.config.hires_fix ? 'Yes' : 'No'}
          />
          <HistoryPhotoviewConfigRow
            label="Styles"
            value={history.config.styles}
          />
        </div>
      </div>
    </ScrollShadow>
  )
}
