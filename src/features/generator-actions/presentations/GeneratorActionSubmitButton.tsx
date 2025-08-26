import { GeneratorConfigFormValues } from '@/features/generator-configs'
import { useGenerationStatusStore } from '@/features/generators/states'
import { Button, Spinner } from '@heroui/react'
import clsx from 'clsx'
import { useFormContext } from 'react-hook-form'

export const GeneratorActionSubmitButton = () => {
  const { watch } = useFormContext<GeneratorConfigFormValues>()
  const { isGenerating } = useGenerationStatusStore()
  const numberOfImages = watch('number_of_images')

  return (
    <Button variant="faded" type="submit" isDisabled={isGenerating}>
      <span
        className={clsx({
          'text-primary': !isGenerating,
          'animate-shine text-primary/40': isGenerating
        })}
      >
        Generate {numberOfImages} images
      </span>
    </Button>
  )
}
