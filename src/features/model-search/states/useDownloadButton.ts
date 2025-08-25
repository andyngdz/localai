import { api } from '@/services'

export const useDownloadButton = (id: string) => {
  const onDownload = () => {
    api.downloadModel(id)
  }

  return { onDownload }
}
