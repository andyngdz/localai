import { ImageGenerationItem, ImageGenerationResponse } from '@/types'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface UseImageGenerationResponseStore extends ImageGenerationResponse {
  onInitResponse: (count: number) => void
  onUpdateResponse: (response: ImageGenerationResponse) => void
}

const createDefaultItem = (): ImageGenerationItem => ({
  path: '',
  file_name: ''
})

const useImageGenerationResponseStore = create<UseImageGenerationResponseStore>()(
  immer((set) => ({
    items: [],
    nsfw_content_detected: [],
    onInitResponse: (count: number) => {
      set((state) => {
        state.items = Array(count).fill(createDefaultItem())
        state.nsfw_content_detected = Array(count).fill(false)
      })
    },
    onUpdateResponse: (response) => {
      set((state) => {
        state.items = response.items
        state.nsfw_content_detected = response.nsfw_content_detected
      })
    }
  }))
)

export { createDefaultItem, useImageGenerationResponseStore }
export type { UseImageGenerationResponseStore }
