'use client'

import { useDownloadWatcherStore } from '@/features/download-watcher'
import { ModelDownloadStatusLine } from '@/features/model-download-status-line'
import { SetupLayout } from '@/features/setup-layout/presentations/SetupLayout'
import { Button } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { FormProvider } from 'react-hook-form'
import { useModelRecommendation } from '../states/useModelRecommendation'
import { ModelRecommendationsList } from './ModelRecommendationsList'

export const ModelRecommendations = () => {
  const router = useRouter()
  const { methods, onSubmit, onSkip, data } = useModelRecommendation()
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
        <div className="flex flex-col items-center gap-6">
          {data && (
            <ModelRecommendationsList
              sections={data.sections}
              defaultSection={data.default_section}
            />
          )}
          {isDownloading && <ModelDownloadStatusLine id={id} />}
          {!isDownloading && (
            <Button onPress={onSkip} variant="light" color="primary" size="sm">
              Skip for now, I will download later
            </Button>
          )}
        </div>
      </SetupLayout>
    </FormProvider>
  )
}
