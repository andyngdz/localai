import {
  HistoryGeneratedImage,
  ImageGenerationItem,
  ImageGenerationResponse,
  ImageGenerationStepEndResponse
} from '@/types'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface UseImageGenerationStore extends ImageGenerationResponse {
  imageStepEnds: ImageGenerationStepEndResponse[]
  onInit: (count: number) => void
  onCompleted: (response: ImageGenerationResponse) => void
  onUpdateImageStepEnd: (response: ImageGenerationStepEndResponse) => void
  onRestore: (generatedImages: HistoryGeneratedImage[]) => void
}

const onCreateDefaultItem = (): ImageGenerationItem => ({
  path: '',
  file_name: ''
})

const onCreateDefaultImageStepEnd = (
  index: number
): ImageGenerationStepEndResponse => ({
  index,
  current_step: 0,
  timestep: 0,
  image_base64: ''
})

const useUseImageGenerationStore = create<UseImageGenerationStore>()(
  immer((set) => ({
    imageStepEnds: [],
    items: [],
    nsfw_content_detected: [],
    onInit: (count: number) => {
      set((state) => {
        const imageStepEnds: ImageGenerationStepEndResponse[] = []
        const items: ImageGenerationItem[] = []
        const nsfw_content_detected: boolean[] = []

        for (let index = 0; index < count; index++) {
          imageStepEnds.push(onCreateDefaultImageStepEnd(index))
          items.push(onCreateDefaultItem())
          nsfw_content_detected.push(false)
        }

        state.imageStepEnds = imageStepEnds
        state.items = items
        state.nsfw_content_detected = nsfw_content_detected
      })
    },
    onCompleted: (response) => {
      set((state) => {
        state.items = response.items
        state.nsfw_content_detected = response.nsfw_content_detected
      })
    },
    onUpdateImageStepEnd: (imageStepEnd) => {
      set((state) => {
        state.imageStepEnds[imageStepEnd.index] = imageStepEnd
      })
    },
    onRestore: (generatedImages: HistoryGeneratedImage[]) => {
      set((state) => {
        const imageStepEnds: ImageGenerationStepEndResponse[] = []
        const items: ImageGenerationItem[] = []
        const nsfw_content_detected: boolean[] = []

        generatedImages.forEach((g, index) => {
          imageStepEnds.push(onCreateDefaultImageStepEnd(index))
          items.push({ path: g.path, file_name: g.file_name })
          nsfw_content_detected.push(g.is_nsfw)
        })

        state.imageStepEnds = imageStepEnds
        state.items = items
        state.nsfw_content_detected = nsfw_content_detected
      })
    }
  }))
)

export {
  onCreateDefaultItem,
  onCreateDefaultImageStepEnd,
  useUseImageGenerationStore
}
export type { UseImageGenerationStore }
