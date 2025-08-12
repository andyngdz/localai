import { StyleSection } from "@/types";
import {
  Avatar,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalProps,
} from "@heroui/react";
import { FC } from "react";

export interface GeneratorConfigStyleModalProps extends Omit<ModalProps, "children"> {
  styleSections: StyleSection[];
}

export const GeneratorConfigStyleModal: FC<GeneratorConfigStyleModalProps> = ({
  styleSections,
  ...restProps
}) => {
  console.info(styleSections);
  return (
    <Modal placement="bottom" {...restProps}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Styles</ModalHeader>
        <ModalBody className="p-0">
          {styleSections.map((s) => {
            return (
              <div key={s.id} className="flex flex-col gap-2">
                <span className="text-lg font-medium capitalize bg-foreground-100 p-2">{s.id}</span>
                <div className="flex flex-wrap gap-2 p-2">
                  {s.styles.map((style) => {
                    return (
                      <Chip
                        avatar={
                          <Avatar
                            src={`http://localhost:8000/static/${style.image}`}
                            alt={style.name}
                            size="sm"
                          />
                        }
                        variant="bordered"
                        key={style.id}
                      >
                        {style.name}
                      </Chip>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
