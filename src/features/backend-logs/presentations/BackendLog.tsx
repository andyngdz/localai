'use client'

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
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
        className="text-default-700"
        onPress={onOpen}
        endContent={<SquareChevronRight size={16} />}
      >
        Console
      </Button>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement="right"
        scrollBehavior="inside"
        size="5xl"
        radius="none"
      >
        <DrawerContent>
          <DrawerHeader>Backend Logs</DrawerHeader>
          <DrawerBody>
            <BackendLogList />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </section>
  )
}
