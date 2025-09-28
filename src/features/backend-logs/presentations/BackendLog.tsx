'use client'

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure
} from '@heroui/react'
import { SquareChevronRight } from 'lucide-react'

export const BackendLog = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <section>
      <Button
        variant="light"
        className="italic text-default-700"
        onPress={onOpen}
        endContent={<SquareChevronRight size={16} />}
      >
        Console
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" placement="bottom">
        <ModalContent>
          <ModalHeader>Backend Logs</ModalHeader>
        </ModalContent>
      </Modal>
    </section>
  )
}
