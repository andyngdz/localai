import NextImage from 'next/image';
import { useGeneratorPreviewer } from '../states';

export const GeneratorPreviewer = () => {
  const { images } = useGeneratorPreviewer();

  console.info(images);

  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((image) => {
        const dataUrl = `data:image/png;base64,${image.image_base64}`;
        return (
          <div key={image.index} className="relative w-full h-full aspect-square">
            <NextImage
              key={image.index}
              src={dataUrl}
              alt={`Image step: ${image.current_step}`}
              fill
            />
          </div>
        );
      })}
    </div>
  );
};
