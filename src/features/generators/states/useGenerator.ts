import { GeneratorConfigFormValues } from '@/features/generator-configs';
import { useImageStepEndResponseStore } from '@/features/generator-previewers/states';
import { api } from '@/services/api';
import { ImageGenerationRequest } from '@/types';
import { addToast } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { SubmitHandler } from 'react-hook-form';

export const useGenerator = () => {
  const { initImages } = useImageStepEndResponseStore();

  const generator = useMutation({
    mutationKey: ['generator'],
    mutationFn: (request: ImageGenerationRequest) => {
      return api.generator(request);
    },
    onError() {
      addToast({
        title: 'Something went wrong',
        description: 'There was an error generating your image.',
        color: 'danger',
      });
    },
  });

  const addHistory = useMutation({
    mutationKey: ['addHistory'],
    mutationFn: (config: GeneratorConfigFormValues) => {
      return api.addHistory(config);
    },
    onSuccess: () => {
      addToast({
        title: 'Added history',
        description: 'Your generation has been added to history.',
        color: 'success',
      });
    },
    onError: () => {
      addToast({
        title: 'Something went wrong',
        description: 'There was an error adding your generation to history.',
        color: 'danger',
      });
    },
  });

  const onGenerate: SubmitHandler<GeneratorConfigFormValues> = async (config) => {
    const history_id = await addHistory.mutateAsync(config);

    initImages(config.number_of_images);
    await generator.mutateAsync({ history_id, config });
  };

  return { onGenerate };
};
