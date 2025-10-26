import { useUseImageGenerationStore } from '@/features/generators'
import { SocketEvents, useSocketEvent } from '@/cores/sockets'
import { ImageGenerationStepEndResponse } from '@/types'
import { useCallback } from 'react'

export const useGeneratorPreviewer = () => {
  const { imageStepEnds, onUpdateImageStepEnd, items } =
    useUseImageGenerationStore()

  const handleImageGenerationStepEnd = useCallback(
    (response: ImageGenerationStepEndResponse) => {
      onUpdateImageStepEnd(response)
    },
    [onUpdateImageStepEnd]
  )

  useSocketEvent(
    SocketEvents.IMAGE_GENERATION_STEP_END,
    handleImageGenerationStepEnd,
    [handleImageGenerationStepEnd]
  )

  return { imageStepEnds, items }
}
