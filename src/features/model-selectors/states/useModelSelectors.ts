import { useDownloadedModels } from '@/cores/hooks'
import { api } from '@/services'
import { first, isEmpty } from 'es-toolkit/compat'
import { useCallback, useEffect } from 'react'
import { useModelSelectorStore } from './useModelSelectorStores'

export const useModelSelectors = () => {
  const { downloadedModels } = useDownloadedModels()
  const { selected_model_id, setSelectedModelId } = useModelSelectorStore()

  const onLoadModel = useCallback(async (id: string) => {
    if (isEmpty(id)) return

    await api.loadModel({ id })
  }, [])

  useEffect(() => {
    if (downloadedModels && isEmpty(selected_model_id)) {
      const firstModel = first(downloadedModels)

      if (firstModel) setSelectedModelId(firstModel.model_id)
    }
  }, [downloadedModels, selected_model_id, setSelectedModelId])

  useEffect(() => {
    onLoadModel(selected_model_id)
  }, [onLoadModel, selected_model_id])

  return { downloadedModels }
}
