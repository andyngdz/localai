import { useDownloadedModels } from '@/cores/hooks'
import { api } from '@/services'
import { first, isEmpty } from 'es-toolkit/compat'
import { useCallback, useEffect } from 'react'
import { useModelSelectorStore } from './useModelSelectorStores'

export const useModelSelectors = () => {
  const { data = [] } = useDownloadedModels()
  const { selected_model_id, setSelectedModelId } = useModelSelectorStore()

  const onLoadModel = useCallback(
    async (id: string) => {
      if (isEmpty(selected_model_id)) return

      await api.loadModel({ id })
    },
    [selected_model_id]
  )

  useEffect(() => {
    if (data && isEmpty(selected_model_id)) {
      const firstModel = first(data)

      if (firstModel) setSelectedModelId(firstModel.model_id)
    }
  }, [data, selected_model_id, setSelectedModelId])

  useEffect(() => {
    onLoadModel(selected_model_id)
  }, [onLoadModel, selected_model_id])

  return { data }
}
