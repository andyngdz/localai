import { invoke } from '@tauri-apps/api/core'
import { addToast } from '@heroui/react'

export const useDownloadImages = () => {
  const onDownloadImage = async (url: string) => {
    try {
      await invoke('download_image', { url })
    } catch (error) {
      const description = error instanceof Error ? error.message : 'Unknown error occurred'

      addToast({
        title: 'Failed to download image',
        description,
        color: 'warning'
      })
    }
  }

  return { onDownloadImage }
}
