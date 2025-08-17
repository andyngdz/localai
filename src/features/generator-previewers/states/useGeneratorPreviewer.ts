import {
  useImageGenerationResponseStore,
  useImageStepEndResponseStore,
} from '@/features/generators/states';
import { socket, SocketEvents } from '@/sockets';
import { ImageGenerationStepEndResponse } from '@/types';
import { useCallback, useEffect } from 'react';

export const useGeneratorPreviewer = () => {
  const { imageStepEnds, onUpdateImageStepEnd } = useImageStepEndResponseStore();
  const { items, nsfw_content_detected } = useImageGenerationResponseStore();

  const onImageGenerationStepEnd = useCallback(() => {
    socket.on(
      SocketEvents.IMAGE_GENERATION_STEP_END,
      (response: ImageGenerationStepEndResponse) => {
        onUpdateImageStepEnd(response);
      },
    );
  }, [onUpdateImageStepEnd]);

  useEffect(() => {
    onImageGenerationStepEnd();
  }, [onImageGenerationStepEnd]);

  return { imageStepEnds, items, nsfw_content_detected };
};
