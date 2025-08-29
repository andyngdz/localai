import { GeneratorConfigFormValues } from '@/features/generator-configs/types/generator-config'
import { Button } from '@heroui/react'
import { useFormContext } from 'react-hook-form'
import { COMMON_STEPS } from '../constants'

export const GeneratorConfigCommonSteps = () => {
  const { setValue } = useFormContext<GeneratorConfigFormValues>()

  return (
    <div className="flex">
      {COMMON_STEPS.map((step) => (
        <Button
          key={step}
          variant="light"
          className="text-default-500"
          onPress={() => {
            setValue('steps', step)
          }}
          isIconOnly
        >
          {step}
        </Button>
      ))}
    </div>
  )
}
