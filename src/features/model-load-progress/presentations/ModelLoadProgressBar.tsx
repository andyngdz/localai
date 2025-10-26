'use client'

import { Progress } from '@heroui/react'
import { Activity } from 'react'
import { useModelLoadProgress } from '../states'

export const ModelLoadProgressBar = () => {
  const { isLoading, message, percentage } = useModelLoadProgress()

  return (
    <Activity mode={isLoading ? 'visible' : 'hidden'}>
      <div className="w-full px-4 py-2 bg-default-100">
        <Progress
          size="sm"
          value={percentage}
          color="primary"
          label={message}
          showValueLabel
          className="max-w-full"
          classNames={{
            label: 'text-xs text-default-700',
            value: 'text-xs text-default-700'
          }}
        />
      </div>
    </Activity>
  )
}
