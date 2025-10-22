import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Tabs,
  Tab,
  Divider
} from '@heroui/react'
import { GeneralSettings, ModelManagement, UpdateSettings } from './tabs'
import { FC } from 'react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: VoidFunction
}

export const SettingsModal: FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" backdrop="blur">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Settings</ModalHeader>
        <Divider />
        <ModalBody className="p-0">
          <Tabs
            aria-label="Settings tabs"
            variant="light"
            className="min-h-[80vh]"
            classNames={{
              base: 'border-r border-default p-4',
              tab: 'justify-start',
              panel: 'w-full p-4'
            }}
            isVertical
          >
            <Tab key="general" title="General">
              <GeneralSettings />
            </Tab>
            <Tab key="models" title="Model Management">
              <ModelManagement />
            </Tab>
            <Tab key="updates" title="Updates">
              <UpdateSettings />
            </Tab>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
