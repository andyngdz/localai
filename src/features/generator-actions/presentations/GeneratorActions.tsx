import { GeneratorConfigFormValues } from '@/features/generator-configs'
import { Button, Select, SelectItem } from '@heroui/react'
import { useFormContext } from 'react-hook-form'

export const GeneratorActions = () => {
  const { watch } = useFormContext<GeneratorConfigFormValues>()
  const numberOfImages = watch('number_of_images')

  return (
    <div className="flex justify-between gap-4 p-4">
      <Button color="primary" variant="bordered" type="submit">
        Generate {numberOfImages} images
      </Button>
      <Select className="max-w-32" defaultSelectedKeys={['grid']} aria-label="View">
        <SelectItem key="grid">Grid View</SelectItem>
        <SelectItem key="list">List View</SelectItem>
      </Select>
    </div>
  )
}
