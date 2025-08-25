import { ChipProps } from '@heroui/react'

class ModelTagService {
  variants: Array<ChipProps['color']> = ['success', 'warning', 'default']

  getChipColor(index: number): ChipProps['color'] {
    return this.variants[index % this.variants.length]
  }
}

export const modelTagService = new ModelTagService()
