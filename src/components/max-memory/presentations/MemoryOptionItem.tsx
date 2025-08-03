import { FC } from "react";
import { MemoryOptionItemProps } from "../types";

export const MemoryOptionItem: FC<MemoryOptionItemProps> = ({
  option,
  isSelected,
  onSelect,
}) => {
  return (
    <div className="badge p-5">
      <div className="flex items-center gap-4">
        <input
          type="radio"
          name="memory-option"
          value={option.value}
          checked={isSelected}
          onChange={onSelect}
          className="radio radio-info cursor-pointer"
        />
        <span className="font-medium text-base-content/60">
          {option.value}% GPU / {option.value}% RAM
        </span>
      </div>
    </div>
  );
};
