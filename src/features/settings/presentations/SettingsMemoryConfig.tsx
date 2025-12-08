'use client'

import { useMaxMemoryMutation } from '@/cores/api-queries'
import { useConfig } from '@/cores/hooks'
import {
  MemoryScaleFactorItems,
  MemoryScaleFactorPreview
} from '@/cores/presentations/memory-scale-factor'
import { DEFAULT_SCALE_FACTOR } from '@/features/max-memory-scale-factor/constants'
import { Divider, SliderValue } from '@heroui/react'
import { useCallback } from 'react'

export const SettingsMemoryConfig = () => {
  const { gpu_scale_factor, ram_scale_factor } = useConfig()
  const { mutate: setMaxMemory } = useMaxMemoryMutation()

  const gpuScaleFactor = gpu_scale_factor || DEFAULT_SCALE_FACTOR
  const ramScaleFactor = ram_scale_factor || DEFAULT_SCALE_FACTOR

  const onGpuChange = useCallback(
    (value: SliderValue) => {
      const numericValue = Number(value)
      if (Number.isNaN(numericValue)) return

      setMaxMemory({
        gpuScaleFactor: numericValue,
        ramScaleFactor
      })
    },
    [ramScaleFactor, setMaxMemory]
  )

  const onRamChange = useCallback(
    (value: SliderValue) => {
      const numericValue = Number(value)
      if (Number.isNaN(numericValue)) return

      setMaxMemory({
        gpuScaleFactor,
        ramScaleFactor: numericValue
      })
    },
    [gpuScaleFactor, setMaxMemory]
  )

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
