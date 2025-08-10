import { GeneratorConfigFormValues } from "@/features/generator-configs/types/generator-config";
import { Checkbox, Input } from "@heroui/react";
import { useFormContext } from "react-hook-form";

export const GeneratorConfigFormat = () => {
  const { register } = useFormContext<GeneratorConfigFormValues>();

  return (
    <div className="flex flex-col gap-4 p-4">
      <span className="font-semibold text-sm">Format</span>
      <div className="flex gap-4">
        <Input
          startContent={<span className="text-sm text-foreground-500">W</span>}
          {...register("width")}
        />
        <Input
          startContent={<span className="text-sm text-foreground-500">H</span>}
          {...register("height")}
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
