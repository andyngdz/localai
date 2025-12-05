import { SliderProps } from '@heroui/react'

export interface MemoryOption {
  scaleFactor: number
  label: string
}

export interface MaxMemoryFormProps {
  gpuScaleFactor: number
  ramScaleFactor: number
}

export interface MemoryColorClasses {
  bgClassName: string
  textClassName: string
  color: SliderProps['color']
}
