import { UpscaleFactor, UpscalerType } from '@/cores/constants'

export const UPSCALE_FACTORS = [
  { value: UpscaleFactor.ONE_POINT_FIVE, label: '1.5x' },
  { value: UpscaleFactor.TWO, label: '2x' },
  { value: UpscaleFactor.THREE, label: '3x' },
  { value: UpscaleFactor.FOUR, label: '4x' }
]

export const UPSCALERS = [
  { value: UpscalerType.LATENT, label: 'Latent' },
  { value: UpscalerType.LATENT_NEAREST, label: 'Latent (nearest)' },
  { value: UpscalerType.LATENT_NEAREST_EXACT, label: 'Latent (nearest-exact)' }
]
