import { Button, Card, CardBody, CardHeader, Slider } from '@heroui/react'
import type { LoRA } from '@/types'
import { X } from 'lucide-react'
import { FC } from 'react'

interface LoraCardProps {
  lora: LoRA
  weight: number
  onWeightChange: (weight: number) => void
  onRemove: VoidFunction
}

export const LoraCard: FC<LoraCardProps> = ({
  lora,
  weight,
  onWeightChange,
  onRemove
}) => {
  return (
    <Card shadow="sm">
      <CardHeader className="flex justify-between items-center">
        <span className="font-semibold text-sm">{lora.name}</span>
        <Button size="sm" isIconOnly variant="light" onPress={onRemove}>
          <X size={16} />
        </Button>
      </CardHeader>

      <CardBody>
        <Slider
          size="sm"
          step={0.05}
          minValue={0}
          maxValue={2}
          value={weight}
          onChange={(value) => onWeightChange(value as number)}
          className="max-w-full"
        />
        <span className="text-xs text-default-500 text-center mt-1">
          Weight: {weight.toFixed(2)}
        </span>
      </CardBody>
    </Card>
  )
}
