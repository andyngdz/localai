'use client'

import { useDownloadWatcherStore } from '@/features/download-watcher'
import { ModelDownloadStatusLine } from '@/features/model-download-status-line'
import { SetupLayout } from '@/features/setup-layout/presentations/SetupLayout'
import { useRouter } from 'next/navigation'
import { FormProvider } from 'react-hook-form'
import { useModelRecommendation } from '../states/useModelRecommendation'
import { ModelRecommendationsList } from './ModelRecommendationsList'

export const ModelRecommendations = () => {
  const router = useRouter()
  const { methods, onSubmit, data } = useModelRecommendation()
  const id = useDownloadWatcherStore((state) => state.id)
  const isDownloading = !!id

  return (
    <FormProvider {...methods}>
      <SetupLayout
        title="Model Recommendations"
        description="Choose an AI model that fits your hardware capabilities and performance needs"
        onNext={methods.handleSubmit(onSubmit)}
        onBack={router.back}
        isNextDisabled={isDownloading}
        isBackDisabled={isDownloading}
      >
        {data && (
          <ModelRecommendationsList
            sections={data.sections}
            defaultSection={data.default_section}
          />
        )}
        <ModelDownloadStatusLine id={id} />
      </SetupLayout>
    </FormProvider>
  )
}
