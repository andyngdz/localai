import clsx from 'clsx';
import { useGeneratorPreviewer } from '../states';
import { GeneratorPreviewerItem } from './GeneratorPreviewerItem';

export const GeneratorPreviewer = () => {
  const { images } = useGeneratorPreviewer();

  return (
    <div
      className={clsx(
        'grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))]',
        'gap-4 p-4',
        'overflow-auto',
      )}
    >
      {images.map((image) => {
        return <GeneratorPreviewerItem key={image.index} image={image} />;
      })}
    </div>
  );
};
