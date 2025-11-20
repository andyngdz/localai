import type { LoRA } from '@/types'
import { Button, Card, CardBody, CardHeader, Slider } from '@heroui/react'
import { X } from 'lucide-react'
import { FC } from 'react'

interface LoraCardProps {
  lora: LoRA
  onRemove: VoidFunction
}

import { useLoraCard } from '@/features/extra-loras/states/useLoraCard'

export const LoraCard: FC<LoraCardProps> = ({ lora, onRemove }) => {
  const { weight, setWeight } = useLoraCard(lora.id)

  return (
    <Card shadow="none" className="border border-default-200 bg-content1/30">
      <CardHeader className="flex justify-between items-center pb-0">
        <span className="font-semibold text-sm">{lora.name}</span>
        <Button
          size="sm"
          variant="light"
          radius="full"
          onPress={onRemove}
          isIconOnly
        >
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
          onChange={(value) => setWeight(value as number)}
          className="max-w-full"
          label="Weight"
        />
      </CardBody>
    </Card>
  )
}
