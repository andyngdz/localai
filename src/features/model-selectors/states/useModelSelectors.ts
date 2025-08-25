import { api } from '@/services'
import { first, isEmpty } from 'es-toolkit/compat'
import { useEffect } from 'react'
import { useModelSelectorStore } from './useModelSelectorStores'
import { useDownloadedModels } from '@/cores/hooks'

export const useModelSelectors = () => {
  const { data = [] } = useDownloadedModels()
  const { id, setId } = useModelSelectorStore((state) => state)

  const onLoadModel = async (id: string) => {
    if (isEmpty(id)) return
    await api.loadModel({ id })
  }

  useEffect(() => {
    if (data && isEmpty(id)) {
      const firstModel = first(data)
      if (firstModel) setId(firstModel.model_id)
    }
  }, [data, id, setId])

  useEffect(() => {
    onLoadModel(id)
  }, [id])

  return { data }
}
