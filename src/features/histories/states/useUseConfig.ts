import { useFormValuesStore } from '@/features/generators/states'
import { HistoryItem } from '@/types'

export const useUseConfig = (history: HistoryItem) => {
  const { onSetValues } = useFormValuesStore()

  const onUseConfig = () => {
    onSetValues(history.config)
  }

  return { onUseConfig }
}
