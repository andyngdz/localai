import { HistoryItem } from '@/types'
import { Button, Tooltip } from '@heroui/react'
import { Bolt } from 'lucide-react'
import { FC } from 'react'
import { useUseConfig } from '../states/useUseConfig'

export interface HistoryUseConfigButtonProps {
  history: HistoryItem
}

export const HistoryUseConfigButton: FC<HistoryUseConfigButtonProps> = ({
  history
}) => {
  const { onUseConfig } = useUseConfig(history)

  return (
    <Tooltip content="Use this config">
      <Button isIconOnly variant="light" size="sm" onPress={onUseConfig}>
        <Bolt className="text-default-500" size={16} />
      </Button>
    </Tooltip>
  )
}
