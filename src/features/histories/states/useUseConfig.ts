import { useFormValuesStore, useUseImageGenerationStore } from '@/features/generators'
import { HistoryItem } from '@/types'

export const useUseConfig = (history: HistoryItem) => {
  const { onSetValues } = useFormValuesStore()
  const { onRestore } = useUseImageGenerationStore()

  const onUseConfig = () => {
    const { config } = history
    onSetValues(config)
    onRestore(history.generated_images)
  }

  return { onUseConfig }
}
