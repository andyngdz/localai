import { GeneratorConfigFormValues } from '@/features/generator-configs'
import { api } from '@/services'
import { ImageGenerationRequest } from '@/types'
import { addToast } from '@heroui/react'
import { useMutation } from '@tanstack/react-query'
import { SubmitHandler } from 'react-hook-form'
import { useImageGenerationResponseStore } from './useImageGenerationResponseStores'
import { useImageStepEndResponseStore } from './useImageStepEndResponseStores'
import { useGenerationStatusStore } from './useGenerationStatusStore'

export const useGenerator = () => {
  const { onInitImageStepEnds } = useImageStepEndResponseStore()
  const { onUpdateResponse, onInitResponse } = useImageGenerationResponseStore()
  const { onSetIsGenerating } = useGenerationStatusStore()

  const generator = useMutation({
    mutationKey: ['generator'],
    mutationFn: (request: ImageGenerationRequest) => {
      return api.generator(request)
    },
    onError: () => {
      addToast({
        title: 'Something went wrong',
        description: 'There was an error generating your image.',
        color: 'danger'
      })
    },
    onSuccess: (response) => {
      onUpdateResponse(response)
    }
  })

  const addHistory = useMutation({
    mutationKey: ['addHistory'],
    mutationFn: (config: GeneratorConfigFormValues) => {
      return api.addHistory(config)
    },
    onSuccess: () => {
      addToast({
        title: 'Added history',
        description: 'Your generation has been added to history.',
        color: 'success'
      })
    },
    onError: () => {
      addToast({
        title: 'Something went wrong',
        description: 'There was an error adding your generation to history.',
        color: 'danger'
      })
    }
  })

  const onGenerate: SubmitHandler<GeneratorConfigFormValues> = async (config) => {
    try {
      onSetIsGenerating(true)
      const history_id = await addHistory.mutateAsync(config)

      onInitImageStepEnds(config.number_of_images)
      onInitResponse(config.number_of_images)

      await generator.mutateAsync({ history_id, config })
    } finally {
      onSetIsGenerating(false)
    }
  }

  return { onGenerate }
}
