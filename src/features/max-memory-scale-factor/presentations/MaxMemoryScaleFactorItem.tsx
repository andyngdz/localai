import { Slider } from '@heroui/react'
import clsx from 'clsx'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { SLIDER_MAX, SLIDER_MIN, SLIDER_STEP } from '../constants'
import { maxMemoryScaleFactorService } from '../services'
import { useMaxMemoryScaleFactorItem } from '../states'
import { MaxMemoryFormProps } from '../types'

export interface MaxMemoryScaleFactorItemProps {
  fieldName: keyof Pick<MaxMemoryFormProps, 'gpuScaleFactor' | 'ramScaleFactor'>
  label: string
  description: string
}

export const MaxMemoryScaleFactorItem: FC<MaxMemoryScaleFactorItemProps> = ({
  fieldName,
  label,
  description
}) => {
  const { control } = useFormContext<MaxMemoryFormProps>()
  const { SLIDER_MARKS } = useMaxMemoryScaleFactorItem()

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field }) => {
        const currentValue = field.value ?? SLIDER_MIN
        const color = maxMemoryScaleFactorService.color(currentValue)

        return (
          <div
            className={clsx('w-full rounded-2xl p-2 transition-colors')}
            data-testid={`memory-slider-${fieldName}`}
          >
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-default-500">{description}</p>
              </div>
            </div>
            <Slider
              aria-label={`${label} slider`}
              value={currentValue}
              onChange={field.onChange}
              onChangeEnd={field.onChange}
              onBlur={field.onBlur}
              minValue={SLIDER_MIN}
              maxValue={SLIDER_MAX}
              step={SLIDER_STEP}
              marks={SLIDER_MARKS}
              color={color}
              hideValue
              classNames={{
                base: 'mt-4',
                value: 'hidden'
              }}
              showSteps
            />
          </div>
        )
      }}
    />
  )
}
