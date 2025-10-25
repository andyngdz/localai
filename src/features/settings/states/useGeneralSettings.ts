import { useForm, useWatch } from 'react-hook-form'
import { useShallowCompareEffect } from 'react-use'
import { SettingFormValues } from '../types/settings'
import { useSettingsStore } from './useSettingsStore'

export const useGeneralSettings = () => {
  const { values, setValues } = useSettingsStore()
  const { register, control } = useForm<SettingFormValues>({
    defaultValues: values,
    values
  })
  const formValues = useWatch({ control })

  useShallowCompareEffect(() => {
    setValues(formValues as SettingFormValues)
  }, [formValues, setValues])

  return { register }
}
