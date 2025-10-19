'use client'

import { Divider, Snippet, Spacer } from '@heroui/react'
import type { BackendStatusCommand } from '@types'
import { isEmpty } from 'es-toolkit/compat'
import { FC } from 'react'

export interface SuggestedCommandsProps {
  commands: BackendStatusCommand[]
}

export const SuggestedCommands: FC<SuggestedCommandsProps> = ({ commands }) => {
  if (isEmpty(commands)) {
    return null
  }

  return (
    <div>
      <Divider className="my-2" />
      <p className="text-tiny uppercase tracking-wide text-default-400">
        Suggested commands
      </p>
      <Spacer y={2} />
      <div className="space-y-3">
        {commands.map((command) => (
          <div key={command.command} className="space-y-1">
            <p className="text-tiny font-semibold text-default-500">
              {command.label}
            </p>
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
