'use client'

import { Listbox, ListboxItem, ScrollShadow } from '@heroui/react'
import { isEmpty } from 'es-toolkit/compat'
import { FC } from 'react'
import type { BackendSetupStatusEntry } from '../states/useBackendSetupStatusStore'
import { BackendStatusItem } from './BackendStatusItem'

export interface BackendStatusListProps {
  statuses: BackendSetupStatusEntry[]
}

export const BackendStatusList: FC<BackendStatusListProps> = ({ statuses }) => {
  if (isEmpty(statuses)) {
    return (
      <div className="text-default-700 animate-pulse">
        Waiting for backend status...
      </div>
    )
  }

  return (
    <ScrollShadow hideScrollBar className="max-h-64 pr-2 pb-6 text-sm">
      <Listbox
        aria-label="Backend setup status"
        selectionMode="none"
        classNames={{
          base: 'gap-4'
        }}
      >
        {statuses.map((status) => (
          <ListboxItem
            key={status.timestamp}
            textValue={status.message}
            classNames={{ base: 'bg-transparent px-0 py-0', title: 'w-full' }}
          >
            <BackendStatusItem status={status} />
          </ListboxItem>
        ))}
      </Listbox>
    </ScrollShadow>
  )
}
