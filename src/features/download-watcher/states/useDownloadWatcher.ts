import { useDownloadWatcherStore } from './useDownloadWatchStore'

export const useDownloadWatcher = (watchId: string) => {
  const { id, percent } = useDownloadWatcherStore()
  const isDownloading = id === watchId

  return {
    isDownloading,
    percent
  }
}
