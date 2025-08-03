import clsx from "clsx";
import { FC } from "react";
import { maxMemoryScaleFactorService } from "../services/max-memory-scale-factor";
import { MemoryOption } from "../types";

export interface MemoryOptionItemProps {
  option: MemoryOption;
}

export const MaxMemoryScaleFactorItem: FC<MemoryOptionItemProps> = ({
  option,
}) => {
  const [bgClassName, textClassName, radioClassName] =
    maxMemoryScaleFactorService.memoryColor(option.value);
  const percent = option.value * 100;

  return (
    <div className={clsx("badge p-5", bgClassName)}>
      <div className="flex items-center gap-4">
        <input
          type="radio"
          name="memory-option"
          value={option.value}
          className={clsx("radio", radioClassName)}
        />
        <span className={clsx("font-medium", textClassName)}>
          {percent}% GPU / {percent}% RAM
        </span>
      </div>
    </div>
  );
};
