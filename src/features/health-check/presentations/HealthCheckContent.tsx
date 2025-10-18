'use client'

import { Chip, ScrollShadow } from '@heroui/react'
import { BackendStatusLevel } from '@types'
import { FC, useMemo } from 'react'
import type { BackendSetupStatusEntry } from '../states/useBackendSetupStatusStore'

export interface HealthCheckContentProps {
  isHealthy: boolean
  statuses: BackendSetupStatusEntry[]
}

export const HealthCheckContent: FC<HealthCheckContentProps> = ({
  isHealthy,
  statuses
}) => {
  const latestStatus = statuses.at(-1)

  const chip = useMemo(() => {
    if (isHealthy) {
      return (
        <Chip color="success">
          <span>LocalAI backend is running and ready to use</span>
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
      <Chip color="danger">
        <span>LocalAI backend is not running</span>
      </Chip>
    )
  }, [isHealthy, latestStatus])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-center">{chip}</div>
      {statuses.length > 0 && (
        <ScrollShadow hideScrollBar className="max-h-64 pr-2 pb-6 text-sm">
          <ul className="space-y-4">
            {statuses.map((status) => (
              <li key={status.timestamp} className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={
                      status.level === BackendStatusLevel.Error
                        ? 'text-danger'
                        : 'text-foreground'
                    }
                  >
                    {status.message}
                  </span>
                  <span className="text-tiny text-default-500">
                    {new Date(status.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {status.commands?.length ? (
                  <div className="space-y-2 pl-4">
                    <p className="text-tiny uppercase tracking-wide text-default-400">
                      Suggested commands
                    </p>
                    <ul className="space-y-2">
                      {status.commands.map((command) => (
                        <li key={command.command}>
                          <p className="text-tiny font-semibold text-default-500">
                            {command.label}
                          </p>
                          <code className="block overflow-x-auto rounded-small bg-default-100 px-2 py-1 text-xs text-default-600">
                            {command.command}
                          </code>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </ScrollShadow>
      )}
    </div>
  )
}
