import { UpscaleFactor, UpscalerType } from '@/cores/constants'

export interface HiresFixConfig {
  upscale_factor: UpscaleFactor
  upscaler: UpscalerType
  denoising_strength: number
  steps: number
}
