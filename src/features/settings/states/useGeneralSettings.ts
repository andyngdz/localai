import { useForm } from 'react-hook-form'
import { SettingFormValues } from '../types/settings'
import { useSettingsStore } from './useSettingsStore'
import { useShallowCompareEffect } from 'react-use'

export const useGeneralSettings = () => {
  'use no memo'
  const { values, setValues } = useSettingsStore()
  const { register, watch } = useForm<SettingFormValues>({
    defaultValues: values,
    values
  })
  const formValues = watch()

  useShallowCompareEffect(() => {
    setValues(formValues)
  }, [formValues, setValues])

  return { register }
}
