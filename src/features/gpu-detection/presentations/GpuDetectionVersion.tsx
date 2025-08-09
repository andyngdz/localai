"use client";

import { Card, Divider } from "@heroui/react";
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
    <Card className="py-4 flex flex-col gap-4">
      <div className="flex items-center justify-between w-full px-4">
        <span className="text-foreground-500">Cuda version</span>
        <span className="text-sm font-bold">{cuda_runtime_version}</span>
      </div>
      <Divider />
      <div className="flex items-center justify-between w-full px-4">
        <span className="text-foreground-500">Driver version</span>
        <span className="text-sm font-bold">{nvidia_driver_version}</span>
      </div>
    </Card>
  );
};
