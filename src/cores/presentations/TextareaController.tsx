import { Textarea, TextAreaProps } from "@heroui/react";
import { Control, FieldValues, Path, useController } from "react-hook-form";

export interface TextAreaControllerProps<T extends FieldValues, C> extends TextAreaProps {
  control: Control<T, C, T>;
  controlName: Path<T>;
}

export const TextAreaController = <T extends FieldValues, C>({
  control,
  controlName,
  ...restProps
}: TextAreaControllerProps<T, C>) => {
  const { field, fieldState } = useController({
    control,
    name: controlName,
  });

  return (
    <Textarea
      {...restProps}
      value={field.value}
      onValueChange={field.onChange}
      errorMessage={fieldState.error?.message}
      isInvalid={fieldState.invalid}
    />
  );
};
