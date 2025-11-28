'use client'

import { useConfig } from '@/cores/hooks'
import { GeneratorConfigFormValues } from '@/features/generator-configs/types/generator-config'
import { Select, SelectItem, Skeleton } from '@heroui/react'
import { Controller, useFormContext } from 'react-hook-form'

export const GeneratorConfigHiresFixUpscaler = () => {
  const { control, setValue } = useFormContext<GeneratorConfigFormValues>()
  const { upscalers } = useConfig()

  const onUpscalerChange = (upscalerValue: string) => {
    const selectedUpscaler = upscalers.find((u) => u.value === upscalerValue)

    if (selectedUpscaler) {
      setValue(
        'hires_fix.denoising_strength',
        selectedUpscaler.suggested_denoise_strength
      )
    }
  }

  return (
    <Controller
      name="hires_fix.upscaler"
      control={control}
      render={({ field }) => {
        if (!field.value) {
          return <Skeleton className="h-14 rounded-medium" />
        }

        return (
          <Select
            label="Upscaler"
            selectedKeys={[field.value]}
            onSelectionChange={(keys) => {
              const selectedKey = keys.currentKey
              if (selectedKey) {
                field.onChange(selectedKey)
                onUpscalerChange(selectedKey)
              }
            }}
            aria-label="Upscaler"
            size="sm"
          >
            {upscalers.map((upscaler) => (
              <SelectItem key={upscaler.value}>{upscaler.name}</SelectItem>
            ))}
          </Select>
        )
      }}
    />
  )
}
