import { useDownloadedModelsQuery } from '@/cores/api-queries'

export const useDownloadedModels = () => {
  const { data = [] } = useDownloadedModelsQuery()

  const onCheckDownloaded = (id: string) => {
    return data.some((model) => model.model_id === id)
  }

  return { downloadedModels: data, onCheckDownloaded }
}
