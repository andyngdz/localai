import { NumberInputController } from '@/cores/presentations/NumberInputController'
import { GeneratorConfigFormValues } from '@/features/generator-configs/types/generator-config'
import { Tooltip } from '@heroui/react'
import { Info } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

export const GeneratorConfigQuantity = () => {
  const { control } = useFormContext<GeneratorConfigFormValues>()

  return (
    <div className="flex flex-col gap-4 p-4">
      <span className="font-semibold text-sm">Quantity</span>
      <div className="flex gap-4">
        <NumberInputController
          aria-label="Number of images"
          control={control}
          controlName="number_of_images"
          minValue={1}
          startContent={<span className="text-sm text-default-500 min-w-fit">Images</span>}
          endContent={
            <Tooltip content="Number of images will be generated">
              <Info className="text-default-500" />
            </Tooltip>
          }
        />
      </div>
    </div>
  )
}
