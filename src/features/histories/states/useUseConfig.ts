import { useFormValuesStore, useImageGenerationResponseStore } from '@/features/generators'
import { HistoryItem, ImageGenerationResponse } from '@/types'

export const useUseConfig = (history: HistoryItem) => {
  const { onSetValues } = useFormValuesStore()
  const { onUpdateResponse } = useImageGenerationResponseStore()

  const onUseConfig = () => {
    const { config, generated_images } = history

    onSetValues(config)

    const items = generated_images.map((g) => ({
      path: g.path,
      file_name: g.file_name
    }))
    const nsfw_content_detected = generated_images.map((g) => g.is_nsfw)
    const response: ImageGenerationResponse = {
      items,
      nsfw_content_detected
    }

    onUpdateResponse(response)
  }

  return { onUseConfig }
}
