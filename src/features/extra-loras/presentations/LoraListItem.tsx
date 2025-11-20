import { formatter } from '@/services/formatter'
import { LoRA } from '@/types'
import { Card, CardBody, Switch } from '@heroui/react'
import clsx from 'clsx'
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
  return (
    <Card
      tabIndex={0}
      shadow="none"
      onPress={onSelect}
      className={clsx('border border-default', {
        'bg-default': isSelected
      })}
      isPressable
      isHoverable
    >
      <CardBody className="flex flex-row items-center justify-between gap-3 p-3">
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-sm truncate block">
            {lora.name}
          </span>
          <div className="text-xs text-default-500">
            {formatter.formatFileSize(lora.file_size)}
          </div>
        </div>

        <Switch
          aria-label={`Toggle ${lora.name}`}
          size="sm"
          color="primary"
          isSelected={isSelected}
          onValueChange={onSelect}
        />
      </CardBody>
    </Card>
  )
}
