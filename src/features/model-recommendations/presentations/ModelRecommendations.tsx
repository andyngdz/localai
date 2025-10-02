'use client'

import { useDownloadWatcherStore } from '@/features/download-watcher'
import { SetupLayout } from '@/features/setup-layout/presentations/SetupLayout'
import { useRouter } from 'next/navigation'
import { useModelRecommendation } from '../states/useModelRecommendation'
import { ModelRecommendationsList } from './ModelRecommendationsList'

export const ModelRecommendations = () => {
  const router = useRouter()
  const { onNext, data } = useModelRecommendation()
  const id = useDownloadWatcherStore((state) => state.id)
  const isDownloading = !!id

  return (
    <SetupLayout
      title="Model Recommendations"
      description="Choose an AI model that fits your hardware capabilities and performance needs"
      onNext={onNext}
      onBack={router.back}
      isNextDisabled={isDownloading}
      isBackDisabled={isDownloading}
    >
      <div className="flex flex-col items-center gap-6">
        {data && (
          <ModelRecommendationsList
            sections={data.sections}
            defaultSection={data.default_section}
          />
        )}
      </div>
    </SetupLayout>
  )
}
