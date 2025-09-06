import {
  useImageViewModeStore,
  ImageViewMode
} from '@/features/generator-previewers/states/useImageViewModeStore'
import { Select, SelectItem, Selection } from '@heroui/react'
import { GeneratorActionSubmitButton } from './GeneratorActionSubmitButton'

export const GeneratorAction = () => {
  const { viewMode, setViewMode } = useImageViewModeStore()

  const handleSelectionChange = (keys: Selection) => {
    const selectedKey = Array.from(keys)[0] as string
    setViewMode(selectedKey as ImageViewMode)
  }

  return (
    <div className="flex justify-between gap-4 p-4">
      <GeneratorActionSubmitButton />
      <Select
        className="max-w-32"
        selectedKeys={[viewMode]}
        onSelectionChange={handleSelectionChange}
        aria-label="View"
      >
        <SelectItem key="grid">Grid View</SelectItem>
        <SelectItem key="slider">Slider View</SelectItem>
      </Select>
    </div>
  )
}
