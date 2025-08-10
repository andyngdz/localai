import { IntNumberInput } from "@/cores/presentations/IntNumberInput";
import { GeneratorConfigFormValues } from "@/features/generator-configs/types/generator-config";
import { Checkbox } from "@heroui/react";
import { Controller, useFormContext } from "react-hook-form";

export const GeneratorConfigFormat = () => {
  const { register, control } = useFormContext<GeneratorConfigFormValues>();

  return (
    <div className="flex flex-col gap-4 p-4">
      <span className="font-semibold text-sm">Format</span>
      <div className="flex gap-4">
        <Controller
          control={control}
          name="width"
          render={({ field }) => {
            return (
              <IntNumberInput
                isRequired
                aria-label="Width"
                defaultValue={field.value}
                minValue={64}
                startContent={<span className="text-sm text-foreground-500">W</span>}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              />
            );
          }}
        />
        <Controller
          control={control}
          name="height"
          render={({ field }) => {
            return (
              <IntNumberInput
                isRequired
                aria-label="height"
                minValue={64}
                defaultValue={field.value}
                startContent={<span className="text-sm text-foreground-500">H</span>}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              />
            );
          }}
        />
      </div>
      <Checkbox
        {...register("hires_fix")}
        classNames={{
          label: "text-sm",
        }}
      >
        Hires.fix
      </Checkbox>
    </div>
  );
};
