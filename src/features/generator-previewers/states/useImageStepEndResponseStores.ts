/**
 * Add or update an ImageGenerationStepEndResponse in the array immutably.
 * Uses `index` as the stable identifier: appends if missing, otherwise shallow-merges into the existing item.
 */
import { ImageGenerationStepEndResponse } from '@/types';
import { findIndex } from 'es-toolkit/compat';
import { create } from 'zustand';

export function addOrUpdateImageInList(
  images: ImageGenerationStepEndResponse[],
  image: ImageGenerationStepEndResponse,
): ImageGenerationStepEndResponse[] {
  const incomingIndex = image.index;
  const matchIndex = findIndex(images, (image) => image.index === incomingIndex);

  if (matchIndex === -1) {
    return [...images, image];
  }

  images[matchIndex] = image;

  return images;
}

export interface UseImageStepEndResponseStore {
  images: ImageGenerationStepEndResponse[];
  initImages: (count: number) => void;
  updateImage: (response: ImageGenerationStepEndResponse) => void;
}

export const useImageStepEndResponseStore = create<UseImageStepEndResponseStore>((set) => ({
  images: [],
  initImages: (count: number) =>
    set(() => {
      const images = Array(count)
        .keys()
        .map((index) => ({
          index,
          current_step: 0,
          timestep: 0,
          image_base64: '',
        }))
        .toArray();

      return { images };
    }),
  updateImage: (response) =>
    set((state) => ({
      images: addOrUpdateImageInList(state.images, response),
    })),
}));
