'use client'

import { Chip } from '@heroui/react'
import { BackendStatusLevel } from '@types'
import { FC, useMemo } from 'react'
import type { BackendSetupStatusEntry } from '../states/useBackendSetupStatusStore'

export interface HealthStatusChipProps {
  isHealthy: boolean
  latestStatus?: BackendSetupStatusEntry
}

export const HealthStatusChip: FC<HealthStatusChipProps> = ({
  isHealthy,
  latestStatus
}) => {
  const chip = useMemo(() => {
    if (isHealthy) {
      return (
        <Chip color="success">
          <span>Backend is running</span>
        </Chip>
      )
    }

    if (latestStatus) {
      const color =
        latestStatus.level === BackendStatusLevel.Error ? 'danger' : 'secondary'

      return (
        <Chip color={color} className="max-w-full">
          <span className="truncate" title={latestStatus.message}>
            {latestStatus.message}
          </span>
        </Chip>
      )
    }

    return (
      <Chip color="warning">
        <span>Waiting for backend</span>
      </Chip>
    )
  }, [isHealthy, latestStatus])

  return <div className="flex justify-center">{chip}</div>
}
