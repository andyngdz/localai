import { Button } from '@heroui/react'
import { Settings } from 'lucide-react'
import { useDisclosure } from '@heroui/use-disclosure'
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
        className="text-default-500 hover:text-foreground"
      >
        <Settings className="w-5 h-5" />
      </Button>
      <SettingsModal isOpen={isOpen} onClose={onClose} />
    </div>
  )
}
