'use client'

import { useBackendConfigQuery } from '@/cores/api-queries'
import { Upscaler } from '@/types'

interface ConfigResult {
  upscalers: Upscaler[]
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

  return {
    upscalers: data?.upscalers ?? []
  }
}
