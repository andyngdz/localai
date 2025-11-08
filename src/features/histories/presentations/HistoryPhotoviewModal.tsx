'use client'

import { Modal, ModalBody, ModalContent } from '@heroui/react'
import { useHistoryPhotoviewStore } from '../states/useHistoryPhotoviewStore'
import { HistoryPhotoviewCarousel } from './HistoryPhotoviewCarousel'

export const HistoryPhotoviewModal = () => {
  const { isOpen, currentHistoryId, closePhotoview } =
    useHistoryPhotoviewStore()

  return (
    <Modal
      isOpen={isOpen}
      onClose={closePhotoview}
      size="full"
      backdrop="blur"
      scrollBehavior="inside"
      classNames={{
        body: 'p-0'
      }}
    >
      <ModalContent>
        <ModalBody>
          <HistoryPhotoviewCarousel currentHistoryId={currentHistoryId} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
