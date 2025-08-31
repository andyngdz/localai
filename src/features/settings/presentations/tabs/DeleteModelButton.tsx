import { useDeleteModel } from '@/features/settings/states/useDeleteModel'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import { Trash2 } from 'lucide-react'
import { FC, useState } from 'react'

interface DeleteModelButtonProps {
  model_id: string
}

export const DeleteModelButton: FC<DeleteModelButtonProps> = ({ model_id }) => {
  const [isOpen, setIsOpen] = useState(false)
  const deleteModel = useDeleteModel()

  const onConfirm = () => {
    setIsOpen(false)
    deleteModel.mutate(model_id)
  }

  return (
    <div>
      <Button
        isIconOnly
        variant="light"
        color="danger"
        aria-label={`Delete ${model_id}`}
        onPress={() => setIsOpen(true)}
        isDisabled={deleteModel.isPending}
        data-testid="delete-button"
      >
        <Trash2 size={16} />
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
          <ModalHeader>Delete model</ModalHeader>
          <ModalBody>
            <div>Are you sure you want to delete this model?</div>
            <div className="text-danger-500 font-medium break-all">{model_id}</div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button color="danger" isLoading={deleteModel.isPending} onPress={onConfirm}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
