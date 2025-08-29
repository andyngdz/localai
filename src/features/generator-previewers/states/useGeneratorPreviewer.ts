import { useUseImageGenerationStore } from '@/features/generators'
import { socket, SocketEvents } from '@/sockets'
import { ImageGenerationStepEndResponse } from '@/types'
import { useCallback, useEffect } from 'react'

export const useGeneratorPreviewer = () => {
  const { imageStepEnds, onUpdateImageStepEnd, items } = useUseImageGenerationStore()

  const onImageGenerationStepEnd = useCallback(() => {
    socket.on(
      SocketEvents.IMAGE_GENERATION_STEP_END,
      (response: ImageGenerationStepEndResponse) => {
        onUpdateImageStepEnd(response)
      }
    )
  }, [onUpdateImageStepEnd])

  useEffect(() => {
    onImageGenerationStepEnd()
  }, [onImageGenerationStepEnd])

  return { imageStepEnds, items }
}
