import { Slider } from '@heroui/react'
import clsx from 'clsx'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { MEMORY_OPTIONS } from '../constants'
import { maxMemoryScaleFactorService } from '../services'
import { MaxMemoryFormProps } from '../types'

const SLIDER_MARKS = MEMORY_OPTIONS.map((option) => ({
  value: option.scaleFactor,
  label: option.label
}))

const SLIDER_MIN = MEMORY_OPTIONS[0].scaleFactor
const SLIDER_MAX = MEMORY_OPTIONS.at(-1)?.scaleFactor ?? SLIDER_MIN
const SLIDER_STEP = 0.1

export interface MaxMemoryScaleFactorItemProps {
  fieldName: keyof Pick<MaxMemoryFormProps, 'gpuScaleFactor' | 'ramScaleFactor'>
  label: string
  description?: string
}

export const MaxMemoryScaleFactorItem: FC<MaxMemoryScaleFactorItemProps> = ({
  fieldName,
  label,
  description
}) => {
  const { control } = useFormContext<MaxMemoryFormProps>()

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field }) => {
        const currentValue = field.value ?? SLIDER_MIN
        const colors = maxMemoryScaleFactorService.memoryColor(currentValue)

        const handleChange = (nextValue: number | number[]) => {
          const normalized = Array.isArray(nextValue) ? nextValue[0] : nextValue
          field.onChange(Number(normalized.toFixed(1)))
        }

        return (
          <div
            className={clsx('w-full rounded-2xl p-2 transition-colors')}
            data-testid={`memory-slider-${fieldName}`}
          >
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                {description && (
                  <p className="text-xs text-default-500">{description}</p>
                )}
              </div>
            </div>
            <Slider
              aria-label={`${label} slider`}
              value={currentValue}
              onChange={handleChange}
              onChangeEnd={handleChange}
              onBlur={field.onBlur}
              minValue={SLIDER_MIN}
              maxValue={SLIDER_MAX}
              step={SLIDER_STEP}
              showSteps
              marks={SLIDER_MARKS}
              color={colors.color}
              hideValue
              classNames={{
                base: 'mt-4',
                value: 'hidden'
              }}
            />
          </div>
        )
      }}
    />
  )
}
