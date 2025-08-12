import { StyleSection } from "@/types";
import {
  Avatar,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalProps,
  Tooltip,
} from "@heroui/react";
import NextImage from "next/image";
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
                      <Tooltip
                        key={style.id}
                        classNames={{
                          content: "p-0 rounded-lg overflow-hidden",
                        }}
                        content={
                          <NextImage
                            src={`http://localhost:8000/static/${style.image}`}
                            width={128}
                            height={128}
                            alt={style.name}
                          />
                        }
                      >
                        <Chip
                          avatar={
                            <Avatar
                              src={`http://localhost:8000/static/${style.image}`}
                              alt={style.name}
                              size="sm"
                            />
                          }
                          variant="bordered"
                          className="cursor-pointer"
                          onClick={() => {
                            console.info(style);
                          }}
                        >
                          {style.name}
                        </Chip>
                      </Tooltip>
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
