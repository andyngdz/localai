'use client'

import { ModelRecommendationItem } from '@/types/api'
import { Card } from '@heroui/react'
import { Gpu, HardDrive } from 'lucide-react'
import { FC } from 'react'
import { ModelRecommendationMemoryBox } from './ModelRecommendationMemoryBox'
import { ModelRecommendationsBadge } from './ModelRecommendationsBadge'
import { ModelRecommendationsDownloadButton } from './ModelRecommendationsDownloadButton'
import { ModelRecommendationsTags } from './ModelRecommendationsTags'

interface ModelRecommendationsCardProps {
  model: ModelRecommendationItem
}

export const ModelRecommendationsCard: FC<ModelRecommendationsCardProps> = ({
  model
}) => {
  return (
    <Card className="p-4 border-2 border-foreground/10">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4 w-full">
          <div className="flex flex-col gap-2 flex-1">
            <section className="flex justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-lg">{model.name}</h4>
                {model.is_recommended && <ModelRecommendationsBadge />}
              </div>
              <ModelRecommendationMemoryBox
                icon={<HardDrive size={16} />}
                content={model.model_size}
              />
            </section>
            <section className="flex justify-between">
              <span className="text-default-700">{model.description}</span>
              <ModelRecommendationMemoryBox
                icon={<Gpu size={16} />}
                content={`${model.memory_requirement_gb} GB`}
              />
            </section>
            <ModelRecommendationsTags tags={model.tags} />
          </div>
        </div>
        <ModelRecommendationsDownloadButton modelId={model.id} />
      </div>
    </Card>
  )
}
