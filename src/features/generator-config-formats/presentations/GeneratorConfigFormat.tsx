import { GeneratorConfigFormValues } from "@/features/generator-configs/types/generator-config";
import { Checkbox, NumberInput } from "@heroui/react";
import { useFormContext } from "react-hook-form";

export const GeneratorConfigFormat = () => {
  const { register } = useFormContext<GeneratorConfigFormValues>();

  return (
    <div className="flex flex-col gap-4 p-4">
      <span className="font-semibold text-sm">Format</span>
      <div className="flex gap-4">
        <NumberInput
          isRequired
          hideStepper
          minValue={64}
          classNames={{
            inputWrapper: "max-h-8",
          }}
          startContent={<span className="text-sm text-foreground-500">W</span>}
        />
        <NumberInput
          isRequired
          hideStepper
          minValue={64}
          classNames={{
            inputWrapper: "max-h-8",
          }}
          startContent={<span className="text-sm text-foreground-500">H</span>}
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
