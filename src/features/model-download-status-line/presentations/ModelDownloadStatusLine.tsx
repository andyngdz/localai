import { Divider } from '@heroui/react';

export const ModelDownloadStatusLine = () => {
  return (
    <div className="relative">
      <Divider />
      <div className="ml-0.5 mr-0.5 w-[100%] transition-width duration-500 ease-in-out absolute inset-0 border border-primary"></div>
    </div>
  );
};
