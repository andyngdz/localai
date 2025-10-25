import { useForm, useWatch } from 'react-hook-form'
import { SettingFormValues } from '../types/settings'
import { useSettingsStore } from './useSettingsStore'
import { useShallowCompareEffect } from 'react-use'

export const useGeneralSettings = () => {
  const { values, setValues } = useSettingsStore()
  const { register, control } = useForm<SettingFormValues>({
    defaultValues: values,
    values
  })
  const formValues = useWatch({ control })

  useShallowCompareEffect(() => {
    if (formValues) {
      setValues(formValues as SettingFormValues)
    }
  }, [formValues, setValues])

  return { register }
}
