'use client'

import { HardwareResponse } from '@/types'
import { FC } from 'react'
import { GpuDetectionCpuModeOnly } from './GpuDetectionCpuModeOnly'
import { GpuDetectionItems } from './GpuDetectionItems'
import { GpuDetectionVersion } from './GpuDetectionVersion'

interface GpuDetectionContentProps {
  hardwareData: HardwareResponse
}

export const GpuDetectionContent: FC<GpuDetectionContentProps> = ({ hardwareData }) => {
  if (hardwareData) {
    const { is_cuda, cuda_runtime_version, nvidia_driver_version } = hardwareData

    return (
      <div className="flex flex-col gap-4">
        {is_cuda && (
          <GpuDetectionVersion
            cuda_runtime_version={cuda_runtime_version}
            nvidia_driver_version={nvidia_driver_version}
          />
        )}
        <GpuDetectionItems gpus={hardwareData.gpus} />
        {!is_cuda && <GpuDetectionCpuModeOnly />}
      </div>
    )
  }
}
