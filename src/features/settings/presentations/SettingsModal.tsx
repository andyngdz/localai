import { Modal, ModalContent, ModalHeader, ModalBody, Tabs, Tab } from '@heroui/react'
import { GeneralSettings, ModelManagement } from './tabs'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" backdrop="blur">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Settings</ModalHeader>
        <ModalBody className="p-0">
          <Tabs
            aria-label="Settings tabs"
            variant="light"
            className="min-h-[80vh]"
            classNames={{
              base: 'border-r border-default px-4',
              tab: 'justify-left',
              panel: 'w-full'
            }}
            isVertical
          >
            <Tab key="general" title="General">
              <GeneralSettings />
            </Tab>
            <Tab key="models" title="Model Management">
              <ModelManagement />
            </Tab>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
