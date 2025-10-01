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
        backdrop="transparent"
        placement="bottom"
        scrollBehavior="inside"
        className="max-w-full w-6xl h-[40vh]"
      >
        <ModalContent>
          <ModalHeader>Backend Logs</ModalHeader>
          <ModalBody>
            <BackendLogList />
          </ModalBody>
        </ModalContent>
      </Modal>
    </section>
  )
}
