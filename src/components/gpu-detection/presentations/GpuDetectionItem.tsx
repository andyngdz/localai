"use client";

import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { formatter } from "../../../services/formatter";
import { GpuInfo } from "../../../types/api";
import { GpuDetectionForm } from "../types/gpu-detection";

export interface GpuDetectionItemProps {
  gpu: GpuInfo;
  index: number;
}

export const GpuDetectionItem: FC<GpuDetectionItemProps> = ({ gpu, index }) => {
  const { register } = useFormContext<GpuDetectionForm>();
  const { name, cuda_compute_capability, memory, is_primary } = gpu;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <input
          {...register("gpu", { required: true })}
          value={index}
          defaultChecked={is_primary}
          type="radio"
          className="radio"
        />
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{name}</span>
          <span className="text-xs text-base-content/80">
            Cuda compute capability {cuda_compute_capability}
          </span>
        </div>
      </div>
      <span className="text-sm text-base-content/80">
        {formatter.formatBytes(memory)}
      </span>
    </div>
  );
};
