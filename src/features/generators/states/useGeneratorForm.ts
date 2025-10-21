'use client'

import { GeneratorConfigFormValues } from '@/features/generator-configs'
import { FORM_DEFAULT_VALUES } from '@/features/generators/constants'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDeepCompareEffect, useLocalStorage } from 'react-use'
import { useFormValuesStore } from './useFormValuesStore'

export const useGeneratorForm = () => {
  const storeValues = useFormValuesStore((state) => state.values)

  // Get values from localStorage (returns stored value + setter)
  const [localStorageValues, setLocalStorage] = useLocalStorage(
    'generator-form-values',
    FORM_DEFAULT_VALUES
  )

  const methods = useForm<GeneratorConfigFormValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: localStorageValues
  })

  const formValues = methods.watch()

  // Save to localStorage when form changes (non-reactive write)
  useDeepCompareEffect(() => {
    setLocalStorage(formValues)
  }, [formValues, setLocalStorage])

  // Reset form when Zustand updates externally (e.g., history restore)
  useEffect(() => {
    methods.reset(storeValues)
  }, [methods, storeValues])

  return { methods }
}
