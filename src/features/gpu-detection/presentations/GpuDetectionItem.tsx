"use client";

import { formatter } from "@/services/formatter";
import { Radio, RadioProps } from "@heroui/react";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { GpuInfo } from "../../../types/api";
import { GpuDetectionFormProps } from "../types/gpu-detection";

export interface GpuDetectionItemProps extends RadioProps {
  gpu: GpuInfo;
}

export const GpuDetectionItem: FC<GpuDetectionItemProps> = ({
  gpu,
  value,
  ...restProps
}) => {
  const { register } = useFormContext<GpuDetectionFormProps>();
  const { name, cuda_compute_capability, memory, is_primary } = gpu;

  return (
    <Radio
      {...restProps}
      value={value}
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
      defaultChecked={is_primary}
      {...register("gpu", { value })}
    >
      <div className="flex items-center justify-between w-full">
        <span className="font-bold">{name}</span>
        <span className="text-sm text-foreground-500 font-medium">
          {formatter.formatBytes(memory)}
        </span>
      </div>
    </Radio>
  );
};
