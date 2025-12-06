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
export const SLIDER_MIN = 0.5
export const SLIDER_MAX = 0.9

export type SliderConfig = (typeof SLIDER_CONFIGS)[number]
