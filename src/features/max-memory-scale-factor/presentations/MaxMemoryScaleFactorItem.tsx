import { Card, Radio } from '@heroui/react'
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
    <Card
      key={option.scaleFactor}
      className={clsx('border-none shadow-none', bgClassName)}
    >
      <Radio
        value={option.scaleFactor.toString()}
        color={color}
        className="p-5"
      >
        <span className={clsx('font-medium', textClassName)}>
          {percent}% GPU / {percent}% RAM
        </span>
      </Radio>
    </Card>
  )
}
