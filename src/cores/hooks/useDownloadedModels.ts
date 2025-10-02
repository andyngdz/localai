import { useDownloadedModelsQuery } from '@/services'

export const useDownloadedModels = () => {
  const { data = [] } = useDownloadedModelsQuery()

  const onCheckDownloaded = (id: string) => {
    return data.some((model) => model.model_id === id)
  }

  return { downloadedModels: data, onCheckDownloaded }
}
