import { Button } from '@heroui/react'
import { Settings } from 'lucide-react'
import { SettingsModal } from './SettingsModal'
import { useSettingsStore } from '../states/useSettingsStore'

export const SettingsButton = () => {
  const { isModalOpen, openModal, closeModal } = useSettingsStore()

  return (
    <div>
      <Button
        isIconOnly
        variant="light"
        aria-label="Settings"
        onPress={() => openModal()}
        className="text-default-700 hover:text-foreground"
      >
        <Settings size={16} />
      </Button>
      <SettingsModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}
