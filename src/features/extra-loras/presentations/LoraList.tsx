import { useLorasQuery } from '@/cores/api-queries'
import { useLoraSelection } from '../states'
import { LoraListItem } from './LoraListItem'
import { UploadLoraButton } from './UploadLoraButton'

export const LoraList = () => {
  const { data } = useLorasQuery()
  const { toggleLora, selectedLoras } = useLoraSelection()
  const selectedIds = selectedLoras.map((l) => l.id)

  if (!data) {
    return (
      <div className="text-center text-sm text-default-500 py-8">
        No LoRAs available. Upload a LoRA file to get started.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        {data.map((lora) => (
          <LoraListItem
            key={lora.id}
            lora={lora}
            isSelected={selectedIds.includes(lora.id)}
            onSelect={() => toggleLora(lora)}
          />
        ))}
      </div>
      <UploadLoraButton />
    </div>
  )
}
