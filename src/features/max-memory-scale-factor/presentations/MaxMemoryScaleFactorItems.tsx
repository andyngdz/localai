import { RadioGroup } from "@heroui/react";
import { useFormContext } from "react-hook-form";
import { MEMORY_OPTIONS } from "../constants";
import { MaxMemoryFormProps } from "../types";
import { MaxMemoryScaleFactorItem } from "./MaxMemoryScaleFactorItem";

export const MaxMemoryScaleFactorItems = () => {
  const { setValue } = useFormContext<MaxMemoryFormProps>();

  return (
    <RadioGroup
      onValueChange={(value) => {
        setValue("scaleFactor", Number(value));
      }}
    >
      {MEMORY_OPTIONS.map((option) => {
        return (
          <MaxMemoryScaleFactorItem key={option.scaleFactor} option={option} />
        );
      })}
    </RadioGroup>
  );
};
