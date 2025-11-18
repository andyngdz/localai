import type { LoRA } from '@/types'
import { FC } from 'react'

interface LoraListItemProps {
  lora: LoRA
  isSelected: boolean
  onSelect: VoidFunction
}

export const LoraListItem: FC<LoraListItemProps> = ({
  lora,
  isSelected,
  onSelect
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(0)} MB`
  }

  return (
    <button
      onClick={onSelect}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-default-100 w-full text-left transition-colors"
    >
      <div
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
          isSelected ? 'border-primary bg-primary' : 'border-default-300'
        }`}
      >
        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
      </div>

      <div className="flex-1">
        <div className="font-semibold text-sm">{lora.name}</div>
        <div className="text-xs text-default-500">
          {formatFileSize(lora.file_size)}
        </div>
      </div>
    </button>
  )
}
