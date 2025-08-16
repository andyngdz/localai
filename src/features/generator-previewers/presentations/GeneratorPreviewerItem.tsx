import { GeneratorConfigFormValues } from '@/features/generator-configs';
import { ImageGenerationStepEndResponse } from '@/types';
import { Skeleton } from '@heroui/react';
import NextImage from 'next/image';
import { FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

export interface GeneratorPreviewerItemProps {
  image: ImageGenerationStepEndResponse;
}

export const GeneratorPreviewerItem: FC<GeneratorPreviewerItemProps> = ({ image }) => {
  const { watch } = useFormContext<GeneratorConfigFormValues>();
  const width = watch('width');
  const height = watch('height');
  const aspectRatio = width / height;

  const ImageComponent = useMemo(() => {
    if (image.image_base64.length === 0) {
      return <Skeleton className="rounded-2xl w-full h-full" />;
    }

    const src = `data:image/png;base64,${image.image_base64}`;

    return (
      <NextImage
        src={src}
        alt={`Image step: ${image.current_step}`}
        className="rounded-2xl object-cover"
        fill
      />
    );
  }, [image]);

  return (
    <div
      className="relative self-start"
      style={{
        aspectRatio,
      }}
    >
      {ImageComponent}
    </div>
  );
};
