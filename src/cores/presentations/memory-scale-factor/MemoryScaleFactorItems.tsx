'use client'

import { SliderValue } from '@heroui/react'
import { FC } from 'react'
import { MemoryScaleFactorItem } from './MemoryScaleFactorItem'

export interface MemoryScaleFactorItemsProps {
  gpuScaleFactor: number
  ramScaleFactor: number
  onGpuChange: (value: SliderValue) => void
  onRamChange: (value: SliderValue) => void
}

export const MemoryScaleFactorItems: FC<MemoryScaleFactorItemsProps> = ({
  gpuScaleFactor,
  ramScaleFactor,
  onGpuChange,
  onRamChange
}) => (
  <div
    className="flex w-full flex-col gap-6"
    data-testid="memory-scale-factor-sliders"
  >
    <MemoryScaleFactorItem
      fieldName="gpuScaleFactor"
      label="GPU allocation"
      description="Limit VRAM usage"
      value={gpuScaleFactor}
      onChange={onGpuChange}
    />
    <MemoryScaleFactorItem
      fieldName="ramScaleFactor"
      label="RAM allocation"
      description="Limit RAM usage"
      value={ramScaleFactor}
      onChange={onRamChange}
    />
  </div>
)
