"use client";

import { formatter } from "@/services/formatter";
import { GpuInfo } from "@/types";
import { Radio, RadioProps } from "@heroui/react";
import { FC } from "react";

export interface GpuDetectionItemProps extends RadioProps {
  gpu: GpuInfo;
}

export const GpuDetectionItem: FC<GpuDetectionItemProps> = ({ gpu, ...restProps }) => {
  const { name, cuda_compute_capability, memory } = gpu;

  return (
    <Radio
      {...restProps}
      description={
        <span className="flex gap-1 text-xs">
          <span>Cuda compute capability</span>
          <span className="font-bold">{cuda_compute_capability}</span>
        </span>
      }
      classNames={{
        base: "max-w-full p-4",
        labelWrapper: "flex justify-between w-full",
      }}
    >
      <div className="flex items-center justify-between gap-2 w-full">
        <span className="font-bold">{name}</span>
        <span className="text-sm text-foreground-500 font-medium">
          {formatter.formatBytes(memory)}
        </span>
      </div>
    </Radio>
  );
};
