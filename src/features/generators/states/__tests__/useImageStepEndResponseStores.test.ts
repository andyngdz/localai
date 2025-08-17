import { ImageGenerationStepEndResponse } from '@/types';
import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  addOrUpdateImage,
  createDefaultImageStepEnd,
  useImageStepEndResponseStore,
} from '../useImageStepEndResponseStores';

describe('useImageStepEndResponseStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    act(() => {
      useImageStepEndResponseStore.setState({ imageStepEnds: [] });
    });
  });

  it('has empty imageStepEnds array initially', () => {
    expect(useImageStepEndResponseStore.getState().imageStepEnds).toEqual([]);
  });

  describe('onInitImageStepEnds', () => {
    it('initializes the array with the given count of default step ends', () => {
      act(() => {
        useImageStepEndResponseStore.getState().onInitImageStepEnds(3);
      });

      const state = useImageStepEndResponseStore.getState();
      expect(state.imageStepEnds.length).toBe(3);

      // Check that each item has been initialized correctly
      for (let i = 0; i < 3; i++) {
        expect(state.imageStepEnds[i]).toEqual(createDefaultImageStepEnd(i));
      }
    });

    it('replaces existing items when initialized again', () => {
      // Add some initial items
      act(() => {
        useImageStepEndResponseStore.getState().onInitImageStepEnds(2);
      });

      // Now initialize with a different count
      act(() => {
        useImageStepEndResponseStore.getState().onInitImageStepEnds(1);
      });

      const state = useImageStepEndResponseStore.getState();
      expect(state.imageStepEnds.length).toBe(1);
      expect(state.imageStepEnds[0]).toEqual(createDefaultImageStepEnd(0));
    });
  });

  describe('onUpdateImageStepEnd', () => {
    it('adds a new step end when index does not exist', () => {
      const newStepEnd: ImageGenerationStepEndResponse = {
        index: 0,
        current_step: 10,
        timestep: 5,
        image_base64: 'test-image-data',
      };

      act(() => {
        useImageStepEndResponseStore.getState().onUpdateImageStepEnd(newStepEnd);
      });

      const state = useImageStepEndResponseStore.getState();
      expect(state.imageStepEnds.length).toBe(1);
      expect(state.imageStepEnds[0]).toEqual(newStepEnd);
    });

    it('updates an existing step end when index exists', () => {
      // Add initial step end
      const initialStepEnd: ImageGenerationStepEndResponse = {
        index: 0,
        current_step: 5,
        timestep: 2,
        image_base64: 'initial-data',
      };

      act(() => {
        useImageStepEndResponseStore.getState().onUpdateImageStepEnd(initialStepEnd);
      });

      // Update the step end
      const updatedStepEnd: ImageGenerationStepEndResponse = {
        index: 0, // Same index
        current_step: 10,
        timestep: 5,
        image_base64: 'updated-data',
      };

      act(() => {
        useImageStepEndResponseStore.getState().onUpdateImageStepEnd(updatedStepEnd);
      });

      const state = useImageStepEndResponseStore.getState();
      expect(state.imageStepEnds.length).toBe(1);
      expect(state.imageStepEnds[0]).toEqual(updatedStepEnd);
    });

    it('preserves other step ends when adding or updating', () => {
      // Add two step ends
      const stepEnd1: ImageGenerationStepEndResponse = {
        index: 0,
        current_step: 5,
        timestep: 2,
        image_base64: 'data-1',
      };

      const stepEnd2: ImageGenerationStepEndResponse = {
        index: 1,
        current_step: 8,
        timestep: 4,
        image_base64: 'data-2',
      };

      act(() => {
        useImageStepEndResponseStore.getState().onUpdateImageStepEnd(stepEnd1);
        useImageStepEndResponseStore.getState().onUpdateImageStepEnd(stepEnd2);
      });

      // Update stepEnd1
      const updatedStepEnd1: ImageGenerationStepEndResponse = {
        index: 0,
        current_step: 10,
        timestep: 5,
        image_base64: 'updated-data-1',
      };

      act(() => {
        useImageStepEndResponseStore.getState().onUpdateImageStepEnd(updatedStepEnd1);
      });

      const state = useImageStepEndResponseStore.getState();
      expect(state.imageStepEnds.length).toBe(2);
      expect(state.imageStepEnds[0]).toEqual(updatedStepEnd1);
      expect(state.imageStepEnds[1]).toEqual(stepEnd2);
    });
  });
});

describe('addOrUpdateImage', () => {
  it('adds a new image to the array when index does not exist', () => {
    const images: ImageGenerationStepEndResponse[] = [];
    const newImage: ImageGenerationStepEndResponse = {
      index: 0,
      current_step: 5,
      timestep: 3,
      image_base64: 'test-data',
    };

    addOrUpdateImage(images, newImage);

    expect(images.length).toBe(1);
    expect(images[0]).toBe(newImage);
  });

  it('updates an existing image in the array when index exists', () => {
    const existingImage: ImageGenerationStepEndResponse = {
      index: 0,
      current_step: 5,
      timestep: 3,
      image_base64: 'initial-data',
    };

    const images: ImageGenerationStepEndResponse[] = [existingImage];

    const updatedImage: ImageGenerationStepEndResponse = {
      index: 0,
      current_step: 10,
      timestep: 6,
      image_base64: 'updated-data',
    };

    addOrUpdateImage(images, updatedImage);

    expect(images.length).toBe(1);
    expect(images[0]).toBe(updatedImage);
    expect(images[0]).not.toBe(existingImage);
  });

  it('preserves other images in the array when updating', () => {
    const image1: ImageGenerationStepEndResponse = {
      index: 0,
      current_step: 5,
      timestep: 3,
      image_base64: 'data-1',
    };

    const image2: ImageGenerationStepEndResponse = {
      index: 1,
      current_step: 8,
      timestep: 4,
      image_base64: 'data-2',
    };

    const images: ImageGenerationStepEndResponse[] = [image1, image2];

    const updatedImage1: ImageGenerationStepEndResponse = {
      index: 0,
      current_step: 10,
      timestep: 6,
      image_base64: 'updated-data',
    };

    addOrUpdateImage(images, updatedImage1);

    expect(images.length).toBe(2);
    expect(images[0]).toBe(updatedImage1);
    expect(images[1]).toBe(image2);
  });
});

describe('createDefaultImageStepEnd', () => {
  it('creates a default step end with the given index', () => {
    const stepEnd = createDefaultImageStepEnd(5);

    expect(stepEnd).toEqual({
      index: 5,
      current_step: 0,
      timestep: 0,
      image_base64: '',
    });
  });

  it('creates different objects for different indices', () => {
    const stepEnd1 = createDefaultImageStepEnd(1);
    const stepEnd2 = createDefaultImageStepEnd(2);

    expect(stepEnd1).not.toBe(stepEnd2);
    expect(stepEnd1.index).toBe(1);
    expect(stepEnd2.index).toBe(2);
  });
});
