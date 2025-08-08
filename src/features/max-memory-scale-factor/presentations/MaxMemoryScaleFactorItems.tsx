import { RadioGroup } from "@heroui/react";
import { MEMORY_OPTIONS } from "../constants";
import { MaxMemoryScaleFactorItem } from "./MaxMemoryScaleFactorItem";

export const MaxMemoryScaleFactorItems = () => {
  return (
    <RadioGroup>
      {MEMORY_OPTIONS.map((option) => {
        return (
          <MaxMemoryScaleFactorItem key={option.scaleFactor} option={option} />
        );
      })}
    </RadioGroup>
  );
};
