import { GeneratorConfigFormValues } from '@/features/generator-configs/types/generator-config'
import { Textarea } from '@heroui/input'
import { useFormContext } from 'react-hook-form'

export const GeneratorPrompt = () => {
  const { register, formState } = useFormContext<GeneratorConfigFormValues>()

  return (
    <div className="p-4">
      <div className="flex gap-4">
        <Textarea
          className="font-mono"
          label="Prompt"
          maxLength={1000}
          isInvalid={!!formState.errors.prompt}
          {...register('prompt', { required: true })}
        />
        <Textarea
          className="font-mono"
          label="Negative prompt"
          maxLength={1000}
          {...register('negative_prompt')}
        />
      </div>
    </div>
  )
}
