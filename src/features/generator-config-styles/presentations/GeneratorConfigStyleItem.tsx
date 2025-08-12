import { GeneratorConfigFormValues } from "@/features/generator-configs/types/generator-config";
import { StyleItem } from "@/types";
import { Avatar, Chip, Tooltip } from "@heroui/react";
import clsx from "clsx";
import NextImage from "next/image";
import { FC } from "react";
import { useFormContext } from "react-hook-form";

export interface GeneratorConfigStyleItemProps {
  styleItem: StyleItem;
}

export const GeneratorConfigStyleItem: FC<GeneratorConfigStyleItemProps> = ({ styleItem }) => {
  const { setValue, watch } = useFormContext<GeneratorConfigFormValues>();
  const styles = watch("styles");
  const isSelected = styles.includes(styleItem.id);

  return (
    <Tooltip
      key={styleItem.id}
      classNames={{
        content: "p-0 rounded-lg overflow-hidden",
      }}
      content={
        <NextImage
          src={`http://localhost:8000/static/${styleItem.image}`}
          width={196}
          height={196}
          alt={styleItem.name}
        />
      }
    >
      <Chip
        avatar={
          <Avatar
            src={`http://localhost:8000/static/${styleItem.image}`}
            alt={styleItem.name}
            size="sm"
          />
        }
        variant="bordered"
        className={clsx("cursor-pointer transition-all", {
          "border-primary": isSelected,
        })}
        onClick={() => {
          if (isSelected) {
            setValue(
              "styles",
              styles.filter((id) => id !== styleItem.id)
            );
          } else {
            setValue("styles", [...styles, styleItem.id]);
          }
        }}
      >
        {styleItem.name}
      </Chip>
    </Tooltip>
  );
};
