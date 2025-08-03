import { FC } from "react";

export interface GpuDetectionVersionProps {
  cuda_runtime_version: string;
  nvidia_driver_version: string;
}

export const GpuDetectionVersion: FC<GpuDetectionVersionProps> = ({
  cuda_runtime_version,
  nvidia_driver_version,
}) => {
  return (
    <div className="flex flex-col items-center py-4">
      <div className="flex items-center justify-between w-full px-4">
        <span className="text-base-content/70">Cuda version</span>
        <span className="text-sm font-bold">{cuda_runtime_version}</span>
      </div>
      <div className="divider"></div>
      <div className="flex items-center justify-between w-full px-4">
        <span className="text-base-content/70">Driver version</span>
        <span className="text-sm font-bold">{nvidia_driver_version}</span>
      </div>
    </div>
  );
};
