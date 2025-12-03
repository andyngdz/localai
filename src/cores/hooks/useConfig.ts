'use client'

import { useBackendConfigQuery } from '@/cores/api-queries'
import { UpscalerOption, UpscalerSection } from '@/types'

interface ConfigResult {
  upscalers: UpscalerSection[]
  upscalerOptions: UpscalerOption[]
  safety_check_enabled: boolean
}

/**
 * Wrapper hook for backend configuration with default values.
 * Returns config with empty arrays as defaults, eliminating null-checking.
 *
 * Extensibility: To add new config fields:
 * 1. Add field to BackendConfig interface in src/types/api.ts
 * 2. Add field to ConfigResult interface below
 * 3. Add field to return object with default value (e.g., `newField: data?.newField ?? []`)
 */
export const useConfig = (): ConfigResult => {
  const { data } = useBackendConfigQuery()
  const upscalers = data?.upscalers ?? []
  const upscalerOptions = upscalers.flatMap((section) => section.options)
  const safety_check_enabled = data?.safety_check_enabled ?? true

  return {
    upscalers,
    upscalerOptions,
    safety_check_enabled
  }
}
