'use client'

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure
} from '@heroui/react'
import { SquareChevronRight } from 'lucide-react'
import { BackendLogList } from './BackendLogList'

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
      <Modal
        isOpen={isOpen}
        shouldBlockScroll={false}
        isDismissable={false}
        onClose={onClose}
        size="5xl"
        backdrop="transparent"
        placement="bottom"
        scrollBehavior="inside"
      >
        <ModalContent className="max-h-96">
          <ModalHeader>Backend Logs</ModalHeader>
          <ModalBody>
            <BackendLogList />
          </ModalBody>
        </ModalContent>
      </Modal>
    </section>
  )
}
