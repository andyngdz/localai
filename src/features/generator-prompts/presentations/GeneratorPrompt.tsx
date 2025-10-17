import { GeneratorConfigFormValues } from '@/features/generator-configs/types/generator-config'
import { Textarea } from '@heroui/react'
import { useFormContext } from 'react-hook-form'

export const GeneratorPrompt = () => {
  const { register, watch, formState } =
    useFormContext<GeneratorConfigFormValues>()

  return (
    <div className="p-4">
      <div className="flex gap-4">
        <Textarea
          className="font-mono"
          label="Prompt"
          maxLength={1000}
          value={watch('prompt')}
          isInvalid={!!formState.errors.prompt}
          {...register('prompt', { required: true })}
        />
        <Textarea
          className="font-mono"
          label="Negative prompt"
          maxLength={1000}
          value={watch('negative_prompt')}
          {...register('negative_prompt')}
        />
      </div>
    </div>
  )
}
