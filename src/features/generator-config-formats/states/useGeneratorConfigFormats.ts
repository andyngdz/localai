import { UpscaleFactor, UpscalerType } from '@/cores/constants'
import { GeneratorConfigFormValues } from '@/features/generator-configs'
import { useFormContext } from 'react-hook-form'
import { useToggle } from 'react-use'

export const useGeneratorConfigFormats = () => {
  const { watch, setValue, resetField } =
    useFormContext<GeneratorConfigFormValues>()
  const hiresFixValue = watch('hires_fix')
  const [isHiresFixEnabled, toggleIsHiresFixEnabled] =
    useToggle(!!hiresFixValue)

  const onHiresFixToggle = (checked: boolean) => {
    toggleIsHiresFixEnabled()

    if (checked) {
      setValue('hires_fix', {
        upscale_factor: UpscaleFactor.TWO,
        upscaler: UpscalerType.LATENT,
        denoising_strength: 0.7,
        steps: 0
      })
    } else {
      resetField('hires_fix')
    }
  }

  return {
    isHiresFixEnabled,
    onHiresFixToggle
  }
}
