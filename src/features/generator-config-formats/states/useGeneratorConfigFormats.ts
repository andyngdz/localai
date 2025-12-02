import { UpscaleFactor } from '@/cores/constants'
import { useConfig } from '@/cores/hooks'
import { GeneratorConfigFormValues } from '@/features/generator-configs'
import { first } from 'es-toolkit/compat'
import { useFormContext } from 'react-hook-form'
import { useToggle } from 'react-use'

export const useGeneratorConfigFormats = () => {
  const { watch, register, unregister, setValue } =
    useFormContext<GeneratorConfigFormValues>()
  const { upscalerOptions } = useConfig()
  const hiresFixValue = watch('hires_fix')
  const [isHiresFixEnabled, toggleIsHiresFixEnabled] =
    useToggle(!!hiresFixValue)

  const onHiresFixToggle = (checked: boolean) => {
    const defaultUpscaler = first(upscalerOptions)
    toggleIsHiresFixEnabled(checked)

    if (checked) {
      register('hires_fix')

      if (!hiresFixValue && defaultUpscaler) {
        setValue('hires_fix', {
          upscale_factor: UpscaleFactor.TWO,
          upscaler: defaultUpscaler.value,
          denoising_strength: defaultUpscaler.suggested_denoise_strength,
          steps: 0
        })
      }
    } else {
      unregister('hires_fix')
    }
  }

  return {
    isHiresFixEnabled,
    onHiresFixToggle
  }
}
