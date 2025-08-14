import { StyleSection } from "@/types";
import { Modal, ModalBody, ModalContent, ModalHeader, ModalProps } from "@heroui/react";
import { FC } from "react";
import { GeneratorConfigStyleSection } from "./GeneratorConfigStyleSection";

export interface GeneratorConfigStyleModalProps extends Omit<ModalProps, "children"> {
  styleSections: StyleSection[];
}

export const GeneratorConfigStyleModal: FC<GeneratorConfigStyleModalProps> = ({
  styleSections,
  ...restProps
}) => {
  return (
    <Modal placement="bottom" {...restProps}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Styles</ModalHeader>
        <ModalBody className="p-0">
          <GeneratorConfigStyleSection styleSections={styleSections} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
