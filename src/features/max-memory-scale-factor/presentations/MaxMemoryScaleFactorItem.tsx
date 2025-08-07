import clsx from "clsx";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { maxMemoryScaleFactorService } from "../services/max-memory-scale-factor";
import { MaxMemoryFormProps, MemoryOption } from "../types";

export interface MemoryOptionItemProps {
  option: MemoryOption;
}

export const MaxMemoryScaleFactorItem: FC<MemoryOptionItemProps> = ({
  option,
}) => {
  const { register, watch } = useFormContext<MaxMemoryFormProps>();
  const selectedScaleFactor = watch("scaleFactor");
  const percent = option.scaleFactor * 100;
  const isSelected = selectedScaleFactor === option.scaleFactor;

  const colors = maxMemoryScaleFactorService.memoryColor(option.scaleFactor);
  const { bgClassName, textClassName, radioClassName } = colors;

  return (
    <label className={clsx("cursor-pointer badge p-5", bgClassName)}>
      <div className="flex items-center gap-4">
        <input
          type="radio"
          value={option.scaleFactor}
          defaultChecked={isSelected}
          className={clsx("radio", radioClassName)}
          {...register("scaleFactor", {
            required: true,
          })}
        />
        <span className={clsx("font-medium", textClassName)}>
          {percent}% GPU / {percent}% RAM
        </span>
      </div>
    </label>
  );
};
