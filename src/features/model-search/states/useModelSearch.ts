import { api } from '@/services'
import { useQuery } from '@tanstack/react-query'
import { first, isString } from 'es-toolkit/compat'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { ModelSearchFormValues } from '../types'
import { onResetModelId, onUpdateModelId } from './useModelSelectorStores'
import { useDebounce } from '@uidotdev/usehooks'

export const useModelSearch = () => {
  const { watch } = useFormContext<ModelSearchFormValues>()
  const query = watch('query')
  const queryDebounced = useDebounce(query, 500)

  const { data, isLoading } = useQuery({
    queryKey: ['modelSearch', queryDebounced],
    enabled: isString(queryDebounced),
    queryFn: () => api.searchModel(queryDebounced)
  })

  useEffect(() => {
    onResetModelId()
  }, [queryDebounced])

  useEffect(() => {
    if (data) {
      const { models_search_info } = data
      const firstModelSearchInfo = first(models_search_info)

      if (firstModelSearchInfo) {
        onUpdateModelId(firstModelSearchInfo.id)
      }
    }
  }, [data])

  return { data, isLoading }
}
