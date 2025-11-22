import { Radio } from '@heroui/react'
import clsx from 'clsx'
import { FC } from 'react'
import { maxMemoryScaleFactorService } from '../services'
import { MemoryOption } from '../types'

export interface MaxMemoryScaleFactorItemProps {
  option: MemoryOption
}

export const MaxMemoryScaleFactorItem: FC<MaxMemoryScaleFactorItemProps> = ({
  option
}) => {
  const percent = option.scaleFactor * 100
  const colors = maxMemoryScaleFactorService.memoryColor(option.scaleFactor)
  const { bgClassName, textClassName, color } = colors

  return (
    <Radio
      value={option.scaleFactor.toString()}
      color={color}
      classNames={{
        base: clsx(
          'inline-flex m-0 bg-content1 items-center justify-between',
          'flex-row-reverse max-w-full cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent',
          bgClassName
        )
      }}
    >
      <span className={clsx('font-medium', textClassName)}>
        {percent}% GPU / {percent}% RAM
      </span>
    </Radio>
  )
}
