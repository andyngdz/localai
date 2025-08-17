import BackgroundImage from '@/assets/background.jpg';
import clsx from 'clsx';

export const SetupLayoutBackground = () => {
  return (
    <div
      className={clsx(
        'absolute inset-0 -z-10',
        'bg-background/70 bg-blend-overlay',
        'bg-cover bg-center',
      )}
      style={{ backgroundImage: `url(${BackgroundImage.src})` }}
    />
  );
};
