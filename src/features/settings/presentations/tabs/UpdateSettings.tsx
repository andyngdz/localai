import { Button } from '@heroui/react'
import { useUpdaterSettings } from '../../states/useUpdaterSettings'

export const UpdateSettings = () => {
  const { isChecking, onCheck, version } = useUpdaterSettings()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-lg font-semibold">Application updates</span>
        <span className="text-sm text-default-500">
          Current version: {version}
        </span>
      </div>
      <Button onPress={onCheck} color="primary" isLoading={isChecking}>
        {isChecking ? 'Checking…' : 'Check for updates'}
      </Button>
    </div>
  )
}
