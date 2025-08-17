/**
 * Add or update an ImageGenerationStepEndResponse in the array immutably.
 * Uses `index` as the stable identifier: appends if missing, otherwise shallow-merges into the existing item.
 */
import { ImageGenerationStepEndResponse } from '@/types';
import { findIndex } from 'es-toolkit/compat';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface UseImageStepEndResponseStore {
  imageStepEnds: ImageGenerationStepEndResponse[];
  onInitImageStepEnds: (count: number) => void;
  onUpdateImageStepEnd: (response: ImageGenerationStepEndResponse) => void;
}

const addOrUpdateImage = (
  imageStepEnds: ImageGenerationStepEndResponse[],
  imageStepEnd: ImageGenerationStepEndResponse,
) => {
  const incomingIndex = imageStepEnd.index;
  const matchIndex = findIndex(imageStepEnds, (image) => image.index === incomingIndex);

  if (matchIndex === -1) {
    imageStepEnds.push(imageStepEnd);
  } else {
    imageStepEnds[matchIndex] = imageStepEnd;
  }
};

const createDefaultImageStepEnd = (index: number): ImageGenerationStepEndResponse => ({
  index,
  current_step: 0,
  timestep: 0,
  image_base64: '',
});

const useImageStepEndResponseStore = create<UseImageStepEndResponseStore>()(
  immer((set) => ({
    imageStepEnds: [],
    onInitImageStepEnds: (count: number) => {
      set((state) => {
        const imageStepEnds = Array(count).keys().map(createDefaultImageStepEnd).toArray();
        state.imageStepEnds = imageStepEnds;
      });
    },
    onUpdateImageStepEnd: (imageStepEnd) => {
      set((state) => {
        addOrUpdateImage(state.imageStepEnds, imageStepEnd);
      });
    },
  })),
);

export { addOrUpdateImage, createDefaultImageStepEnd, useImageStepEndResponseStore };
export type { UseImageStepEndResponseStore };
