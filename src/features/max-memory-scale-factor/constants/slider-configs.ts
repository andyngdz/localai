import { first, last } from 'es-toolkit/compat'
import { MEMORY_OPTIONS } from './memory-options'

export const SLIDER_CONFIGS = [
  {
    fieldName: 'gpuScaleFactor' as const,
    label: 'GPU allocation',
    description: 'Limit how much VRAM the pipeline can consume.'
  },
  {
    fieldName: 'ramScaleFactor' as const,
    label: 'RAM allocation',
    description: 'Limit how much system RAM background tasks may use.'
  }
]

export const DEFAULT_SCALE_FACTOR = 0.5
export const SLIDER_STEP = 0.1
export const SLIDER_MIN = first(MEMORY_OPTIONS)?.scaleFactor
export const SLIDER_MAX = last(MEMORY_OPTIONS)?.scaleFactor ?? SLIDER_MIN

export type SliderConfig = (typeof SLIDER_CONFIGS)[number]
