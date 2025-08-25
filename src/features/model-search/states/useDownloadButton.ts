import { api } from '@/services/api'

export const useDownloadButton = (id: string) => {
  const onDownload = () => {
    api.downloadModel(id)
  }

  return { onDownload }
}
