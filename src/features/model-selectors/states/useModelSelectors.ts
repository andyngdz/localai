import { api } from '@/services'
import { isEmpty } from 'es-toolkit/compat'
import { useCallback, useEffect } from 'react'
import { useModelSelectorStore } from './useModelSelectorStores'

export const useModelSelectors = () => {
  const selected_model_id = useModelSelectorStore(
    (state) => state.selected_model_id
  )

  const onInitLoadModel = useCallback(() => {
    if (isEmpty(selected_model_id)) return

    api.loadModel({ id: selected_model_id })
  }, [selected_model_id])

  useEffect(() => {
    onInitLoadModel()

    return () => {
      api.unloadModel()
    }
  }, [onInitLoadModel])
}
