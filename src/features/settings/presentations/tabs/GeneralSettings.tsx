import { Switch } from '@heroui/react'
import { useGeneralSettings } from '../../states/useGeneralSettings'

export const GeneralSettings = () => {
  const { register } = useGeneralSettings()

  return (
    <div className="flex flex-col gap-8">
      <Switch {...register('safety_check_enabled')}>Safety check</Switch>
    </div>
  )
}
