import { addToast } from '@heroui/react'

export const useDownloadImages = () => {
  const onDownloadImage = async (url: string) => {
    try {
      await window.electronAPI.downloadImage(url)
    } catch (error) {
      const description =
        error instanceof Error ? error.message : 'Unknown error occurred'

      addToast({
        title: 'Failed to download image',
        description,
        color: 'warning'
      })
    }
  }

  return { onDownloadImage }
}
