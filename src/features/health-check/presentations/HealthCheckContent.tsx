import { FC } from 'react'
import type { BackendSetupStatusEntry } from '../states/useBackendSetupStatusStore'
import { BackendStatusList } from './BackendStatusList'
import { HealthStatusChip } from './HealthStatusChip'

export interface HealthCheckContentProps {
  isHealthy: boolean
  statuses: BackendSetupStatusEntry[]
}

export const HealthCheckContent: FC<HealthCheckContentProps> = ({
  isHealthy,
  statuses
}) => (
  <div className="flex flex-col gap-20">
    <HealthStatusChip isHealthy={isHealthy} latestStatus={statuses.at(-1)} />
    <BackendStatusList statuses={statuses} />
  </div>
)
