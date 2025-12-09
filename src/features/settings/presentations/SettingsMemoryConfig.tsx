'use client'

import {
  MemoryScaleFactorItems,
  MemoryScaleFactorPreview
} from '@/cores/presentations/memory-scale-factor'
import { Divider } from '@heroui/react'
import { useSettingsMemory } from '../states/useSettingsMemory'

export const SettingsMemoryConfig = () => {
  const { gpu_scale_factor, ram_scale_factor, onGpuChange, onRamChange } =
    useSettingsMemory()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold">Memory Configuration</h3>
        <p className="text-sm text-default-500">
          Adjust memory allocation for AI models
        </p>
      </div>
      <Divider />
      <MemoryScaleFactorItems
        gpuScaleFactor={gpu_scale_factor}
        ramScaleFactor={ram_scale_factor}
        onGpuChange={onGpuChange}
        onRamChange={onRamChange}
      />
      <Divider />
      <MemoryScaleFactorPreview
        gpuScaleFactor={gpu_scale_factor}
        ramScaleFactor={ram_scale_factor}
      />
    </div>
  )
}
