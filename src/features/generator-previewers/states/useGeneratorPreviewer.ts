import { socket, SocketEvents } from '@/sockets';
import { ImageGenerationStepEndResponse } from '@/types';
import { useCallback, useEffect } from 'react';
import { useImageStepEndResponseStore } from './useImageStepEndResponseStores';

export const useGeneratorPreviewer = () => {
  const { images, updateImage } = useImageStepEndResponseStore();

  const onImageGenerationStepEnd = useCallback(() => {
    socket.on(
      SocketEvents.IMAGE_GENERATION_STEP_END,
      (response: ImageGenerationStepEndResponse) => {
        updateImage(response);
      },
    );
  }, [updateImage]);

  useEffect(() => {
    onImageGenerationStepEnd();
  }, [onImageGenerationStepEnd]);

  return { images };
};
