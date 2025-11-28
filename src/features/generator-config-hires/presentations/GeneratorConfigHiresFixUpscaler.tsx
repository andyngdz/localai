'use client'

import { GeneratorConfigFormValues } from '@/features/generator-configs/types/generator-config'
import { Select, SelectItem, Skeleton } from '@heroui/react'
import { Controller, useFormContext } from 'react-hook-form'
import { UPSCALERS } from '../constants'

export const GeneratorConfigHiresFixUpscaler = () => {
  const { control } = useFormContext<GeneratorConfigFormValues>()

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
              }
            }}
            aria-label="Upscaler"
            size="sm"
          >
            {UPSCALERS.map((upscaler) => (
              <SelectItem key={upscaler.value}>{upscaler.label}</SelectItem>
            ))}
          </Select>
        )
      }}
    />
  )
}
