import type { LoRA } from '@/types'
import { isEmpty } from 'es-toolkit/compat'
import { FC } from 'react'
import { LoraListItem } from './LoraListItem'

interface LoraListProps {
  loras: LoRA[]
  selectedIds: number[]
  onSelect: (lora: LoRA) => void
}

export const LoraList: FC<LoraListProps> = ({
  loras,
  selectedIds,
  onSelect
}) => {
  if (isEmpty(loras)) {
    return (
      <div className="text-center text-sm text-default-500 py-8">
        No LoRAs available. Upload a LoRA file to get started.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {loras.map((lora) => (
        <LoraListItem
          key={lora.id}
          lora={lora}
          isSelected={selectedIds.includes(lora.id)}
          onSelect={() => onSelect(lora)}
        />
      ))}
    </div>
  )
}
