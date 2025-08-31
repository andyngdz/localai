import { api } from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export const useDownloadedModels = () => {
  const query = useQuery({
    queryKey: ['getDownloadedModels'],
    queryFn: () => api.getDownloadedModels()
  })

  return query
}
