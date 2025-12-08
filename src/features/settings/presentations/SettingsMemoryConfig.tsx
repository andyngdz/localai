'use client'

import {
  MemoryScaleFactorItems,
  MemoryScaleFactorPreview
} from '@/cores/presentations/memory-scale-factor'
import { Divider } from '@heroui/react'
import { useSettingsMemory } from '../states/useSettingsMemory'

export const SettingsMemoryConfig = () => {
  const { gpuScaleFactor, ramScaleFactor, onGpuChange, onRamChange } =
    useSettingsMemory()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold">Memory Configuration</h3>
        <p className="text-sm text-default-500">
          Adjust memory allocation for AI models
        </p>
      </div>
      <MemoryScaleFactorItems
        gpuScaleFactor={gpuScaleFactor}
        ramScaleFactor={ramScaleFactor}
        onGpuChange={onGpuChange}
        onRamChange={onRamChange}
      />
      <Divider />
      <MemoryScaleFactorPreview
        gpuScaleFactor={gpuScaleFactor}
        ramScaleFactor={ramScaleFactor}
      />
    </div>
  )
}
