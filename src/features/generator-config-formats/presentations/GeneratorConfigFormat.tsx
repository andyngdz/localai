import { NumberInputController } from '@/cores/presentations/NumberInputController'
import { GeneratorConfigFormValues } from '@/features/generator-configs/types/generator-config'
import { Checkbox } from '@heroui/react'
import { useFormContext } from 'react-hook-form'

export const GeneratorConfigFormat = () => {
  const { register, control } = useFormContext<GeneratorConfigFormValues>()

  return (
    <div className="flex flex-col gap-4 p-4">
      <span className="font-semibold text-sm">Format</span>
      <div className="flex gap-4">
        <NumberInputController
          aria-label="Width"
          control={control}
          controlName="width"
          minValue={64}
          startContent={<span className="text-sm text-default-700">W</span>}
        />
        <NumberInputController
          aria-label="Height"
          control={control}
          controlName="height"
          minValue={64}
          startContent={<span className="text-sm text-default-700">H</span>}
        />
      </div>
      <Checkbox
        {...register('hires_fix')}
        classNames={{
          label: 'text-sm'
        }}
      >
        Hires.fix
      </Checkbox>
    </div>
  )
}
