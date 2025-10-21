'use client'

import { dateFormatter } from '@/services/date-formatter'
import { Badge } from '@heroui/react'
import { BackendStatusLevel } from '@types'
import { FC } from 'react'
import type { BackendSetupStatusEntry } from '../states/useBackendSetupStatusStore'
import { SuggestedCommands } from './SuggestedCommands'

export interface BackendStatusItemProps {
  status: BackendSetupStatusEntry
}

export const BackendStatusItem: FC<BackendStatusItemProps> = ({ status }) => {
  const isError = status.level === BackendStatusLevel.Error

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <Badge color={isError ? 'danger' : 'secondary'} variant="flat">
          {status.message}
        </Badge>
        <span className="text-tiny text-default-500">
          {dateFormatter.timeFromTimestamp(status.timestamp)}
        </span>
      </div>
      {status.commands && <SuggestedCommands commands={status.commands} />}
    </div>
  )
}
