import { Select, SelectItem } from '@heroui/react'
import { GeneratorActionSubmitButton } from './GeneratorActionSubmitButton'

export const GeneratorAction = () => {
  return (
    <div className="flex justify-between gap-4 p-4">
      <GeneratorActionSubmitButton />
      <Select className="max-w-32" defaultSelectedKeys={['grid']} aria-label="View">
        <SelectItem key="grid">Grid View</SelectItem>
        <SelectItem key="slider">Slider View</SelectItem>
      </Select>
    </div>
  )
}
