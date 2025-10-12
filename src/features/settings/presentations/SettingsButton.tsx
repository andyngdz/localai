import { Button } from '@heroui/react'
import { useDisclosure } from '@heroui/use-disclosure'
import { Settings } from 'lucide-react'
import { SettingsModal } from './SettingsModal'

export const SettingsButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div>
      <Button
        isIconOnly
        variant="light"
        aria-label="Settings"
        onPress={onOpen}
        className="text-default-700 hover:text-foreground"
      >
        <Settings size={16} />
      </Button>
      <SettingsModal isOpen={isOpen} onClose={onClose} />
    </div>
  )
}
