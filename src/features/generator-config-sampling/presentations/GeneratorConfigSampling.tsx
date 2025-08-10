import { GeneratorConfigFormValues } from "@/features/generator-configs/types/generator-config";
import { Input } from "@heroui/react";
import { useFormContext } from "react-hook-form";
import { GeneratorConfigCommonSteps } from "./GeneratorConfigCommonSteps";

export const GeneratorConfigSampling = () => {
  const { register } = useFormContext<GeneratorConfigFormValues>();

  return (
    <div className="flex flex-col gap-4 p-4">
      <span className="font-semibold text-sm">Sampling</span>
      <div className="flex gap-4">
        <Input
          startContent={<span className="text-sm text-foreground-500">Steps</span>}
          {...register("steps")}
        />
        <GeneratorConfigCommonSteps />
      </div>
      <Input
        startContent={<span className="text-sm text-foreground-500 min-w-fit">CFG Scale</span>}
        {...register("cfg_scale")}
      />
    </div>
  );
};
