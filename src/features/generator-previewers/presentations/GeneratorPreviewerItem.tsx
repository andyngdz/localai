import { GeneratorConfigFormValues } from '@/features/generator-configs';
import { ImageGenerationStepEndResponse } from '@/types';
import NextImage from 'next/image';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

export interface GeneratorPreviewerItemProps {
  image: ImageGenerationStepEndResponse;
}

export const GeneratorPreviewerItem: FC<GeneratorPreviewerItemProps> = ({ image }) => {
  const { watch } = useFormContext<GeneratorConfigFormValues>();
  const width = watch('width');
  const height = watch('height');
  const aspectRatio = width / height;
  const src = `data:image/png;base64,${image.image_base64}`;

  return (
    <div
      className="relative self-start"
      style={{
        aspectRatio,
      }}
    >
      <NextImage
        src={src}
        alt={`Image step: ${image.current_step}`}
        className="rounded-2xl object-cover"
        fill
      />
    </div>
  );
};
