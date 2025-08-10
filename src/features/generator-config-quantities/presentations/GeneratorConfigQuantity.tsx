import { GeneratorConfigFormValues } from "@/features/generator-configs/types/generator-config";
import { Input } from "@heroui/react";
import { useFormContext } from "react-hook-form";

export const GeneratorConfigQuantity = () => {
  const { register } = useFormContext<GeneratorConfigFormValues>();

  return (
    <div className="flex flex-col gap-4 p-4">
      <span className="font-semibold text-sm">Quantity</span>
      <div className="flex gap-4">
        <Input
          label={<span className="text-sm text-foreground-500  min-w-fit">Number of images</span>}
          {...register("number_of_images")}
        />
      </div>
    </div>
  );
};
