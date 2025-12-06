import { MEMORY_OPTIONS } from '../constants'

export const useMaxMemoryScaleFactorItem = () => {
  const SLIDER_MARKS = MEMORY_OPTIONS.map((m) => ({
    value: m.scaleFactor,
    label: m.label
  }))

  return { SLIDER_MARKS }
}
