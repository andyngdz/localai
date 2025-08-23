'use client';

import { formatter } from '@/services/formatter';
import { GpuInfo } from '@/types';
import { Radio, RadioProps } from '@heroui/react';
import { FC } from 'react';

export interface GpuDetectionItemProps extends RadioProps {
  gpu: GpuInfo;
}

export const GpuDetectionItem: FC<GpuDetectionItemProps> = ({ gpu, ...restProps }) => {
  const { name, cuda_compute_capability, memory } = gpu;

  return (
    <Radio
      {...restProps}
      description={
        <span className="ml-2 flex gap-1 text-xs">
          <span>Cuda compute capability</span>
          <span className="font-bold">{cuda_compute_capability}</span>
        </span>
      }
      classNames={{
        base: 'max-w-full p-5',
        labelWrapper: 'flex justify-between w-full',
      }}
    >
      <div className="ml-2 flex items-center justify-between gap-2 w-full">
        <span className="font-bold">{name}</span>
        <span className="text-sm text-foreground-500 font-medium">{formatter.bytes(memory)}</span>
      </div>
    </Radio>
  );
};
