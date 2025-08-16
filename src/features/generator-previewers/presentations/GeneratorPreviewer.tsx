import { GeneratorConfigFormValues } from '@/features/generator-configs';
import clsx from 'clsx';
import NextImage from 'next/image';
import { useFormContext } from 'react-hook-form';
import { useGeneratorPreviewer } from '../states';

export const GeneratorPreviewer = () => {
  const { watch } = useFormContext<GeneratorConfigFormValues>();
  const { images } = useGeneratorPreviewer();

  const width = watch('width');
  const height = watch('height');
  const aspectRatio = width / height;

  console.info(aspectRatio);

  return (
    <div
      className={clsx(
        'grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))]',
        'gap-4 p-4',
        'overflow-auto',
      )}
    >
      {images.map((image) => {
        const dataUrl = `data:image/png;base64,${image.image_base64}`;
        return (
          <div
            key={image.index}
            className="relative self-start"
            style={{
              aspectRatio,
            }}
          >
            <NextImage
              key={image.index}
              src={dataUrl}
              alt={`Image step: ${image.current_step}`}
              className="rounded-2xl object-cover"
              fill
            />
          </div>
        );
      })}
    </div>
  );
};
