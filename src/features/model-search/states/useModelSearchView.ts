import { api } from '@/services'
import { useQuery } from '@tanstack/react-query'

export const useModelSearchView = (model_id: string) => {
  const {
    data: modelDetails,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['searchModel', model_id],
    enabled: !!model_id,
    queryFn: async () => {
      const response = await api.modelDetails(model_id)

      return response
    }
  })

  return { modelDetails, isLoading, isError }
}
