import { GeneratorConfigFormValues } from '@/features/generator-configs'
import { useGenerationStatusStore } from '@/features/generators/states'
import { Button } from '@heroui/react'
import clsx from 'clsx'
import { useFormContext } from 'react-hook-form'

export const GeneratorActionSubmitButton = () => {
  const { watch } = useFormContext<GeneratorConfigFormValues>()
  const { isGenerating } = useGenerationStatusStore()
  const numberOfImages = watch('number_of_images')

  return (
    <Button
      color="primary"
      type="submit"
      className="opacity-100"
      isDisabled={isGenerating}
    >
      <span
        className={clsx({
          'animate-shine text-primary/50': isGenerating
        })}
      >
        Generate {numberOfImages} images
      </span>
    </Button>
  )
}
