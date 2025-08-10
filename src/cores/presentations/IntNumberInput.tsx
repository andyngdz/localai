import { NumberInput, NumberInputProps } from "@heroui/react";
import { FC } from "react";

export const IntNumberInput: FC<NumberInputProps> = (props) => {
  return (
    <NumberInput
      hideStepper
      formatOptions={{
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }}
      classNames={{
        inputWrapper: "max-h-8",
      }}
      {...props}
    />
  );
};
