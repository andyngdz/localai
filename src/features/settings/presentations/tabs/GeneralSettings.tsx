import { Input, Switch } from '@heroui/react'
import { useGeneralSettings } from '../../states/useGeneralSettings'

export const GeneralSettings = () => {
  const { register } = useGeneralSettings()

  return (
    <div className="flex flex-col gap-8">
      <Input
        label="API Base URL"
        placeholder="Enter API base URL"
        fullWidth
        {...register('baseUrl')}
      />
      <Switch {...register('safetyCheck')}>Safety check</Switch>
    </div>
  )
}
