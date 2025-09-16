import { StyleSection } from '@/types'
import { Chip, Modal, ModalBody, ModalContent, ModalHeader, ModalProps } from '@heroui/react'
import { FC } from 'react'
import { GeneratorConfigStyleSection } from './GeneratorConfigStyleSection'

export interface GeneratorConfigStyleModalProps extends Omit<ModalProps, 'children'> {
  styleSections: StyleSection[]
}

export const GeneratorConfigStyleModal: FC<GeneratorConfigStyleModalProps> = ({
  styleSections,
  ...restProps
}) => {
  return (
    <Modal placement="bottom" size="2xl" scrollBehavior="inside" {...restProps}>
      <ModalContent>
        <ModalHeader className="flex justify-between items-center gap-2">
          <span>Styles</span>
          <Chip color="warning" variant="flat" size="sm" className="mr-4" role="alert">
            Some styles may contain NSFW content. Please preview before applying
          </Chip>
        </ModalHeader>
        <ModalBody>
          <GeneratorConfigStyleSection styleSections={styleSections} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
