'use client'

import { Divider, Snippet } from '@heroui/react'
import type { BackendStatusCommand } from '@types'
import { isEmpty } from 'es-toolkit/compat'
import { FC } from 'react'

export interface SuggestedCommandsProps {
  commands: BackendStatusCommand[]
}

export const SuggestedCommands: FC<SuggestedCommandsProps> = ({ commands }) => {
  if (isEmpty(commands)) return null

  return (
    <div className="flex flex-col gap-4">
      <Divider />
      <div className="text-tiny uppercase tracking-wide text-default-500">
        Suggested commands
      </div>
      <div className="flex flex-col gap-4">
        {commands.map((command) => (
          <div key={command.command} className="flex felx-col gap-2">
            <div className="text-tiny font-semibold text-default-500">
              {command.label}
            </div>
            <Snippet
              size="sm"
              variant="flat"
              hideSymbol
              classNames={{
                base: 'max-w-full bg-default-100 text-default-600'
              }}
            >
              {command.command}
            </Snippet>
          </div>
        ))}
      </div>
    </div>
  )
}
