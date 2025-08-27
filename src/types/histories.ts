interface HistoryGeneratorFormConfigValues {
  width: number
  height: number
  hires_fix: boolean
  number_of_images: number
  prompt: string
  negative_prompt: string
  cfg_scale: number
  steps: number
  seed: number
  sampler: string
  styles: string[]
}

interface HistoryItem {
  model: string
  created_at: string
  prompt: string
  config: HistoryGeneratorFormConfigValues
  id: number
  updated_at: string
}

export type { HistoryItem, HistoryGeneratorFormConfigValues }
