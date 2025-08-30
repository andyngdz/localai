import { Input, Switch } from '@heroui/react'
import { useSettingsStore } from '../../states'

export const GeneralSettings = () => {
  const { apiBaseUrl, isSafetyCheckEnabled, setApiBaseUrl, toggleSafetyCheck } = useSettingsStore()

  return (
    <div className="flex flex-col gap-8">
      <Input
        label="API Base URL"
        placeholder="Enter API base URL"
        value={apiBaseUrl}
        onChange={(event) => setApiBaseUrl(event.target.value)}
        fullWidth
      />
      <Switch isSelected={isSafetyCheckEnabled} onValueChange={toggleSafetyCheck}>
        Safety check
      </Switch>
    </div>
  )
}
