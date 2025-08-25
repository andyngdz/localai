import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure
} from '@heroui/react'
import { Plus } from 'lucide-react'
import { ModelSearchContainer } from './ModelSearchContainer'

export const ModelSearchOpenIconButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <section>
      <Button onPress={onOpen} variant="light" color="primary" isIconOnly>
        <Plus />
      </Button>
      <Modal isOpen={isOpen} size="full" onClose={onClose} scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Model search</ModalHeader>
          <Divider />
          <ModalBody className="p-0">
            <ModelSearchContainer />
          </ModalBody>
        </ModalContent>
      </Modal>
    </section>
  )
}
