import { useLorasQuery } from '@/cores/api-queries'
import {
  LoraList,
  UploadLoraButton
} from '@/features/extra-loras/presentations'
import { useLoraSelection } from '@/features/extra-loras/states'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalProps,
  Tab,
  Tabs
} from '@heroui/react'
import { FC } from 'react'

export const ExtraModal: FC<Omit<ModalProps, 'children'>> = (props) => {
  const { data } = useLorasQuery()
  const { toggleLora, selectedLoras } = useLoraSelection()

  const selectedIds = selectedLoras.map((l) => l.id)

  return (
    <Modal placement="center" size="2xl" scrollBehavior="inside" {...props}>
      <ModalContent>
        <ModalHeader className="flex items-center justify-between">
          <span>Extra Networks</span>
          <UploadLoraButton />
        </ModalHeader>
        <ModalBody>
          <Tabs>
            <Tab key="lora" title="LoRA">
              <LoraList
                loras={data?.loras || []}
                selectedIds={selectedIds}
                onSelect={toggleLora}
              />
            </Tab>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
