import { GeneratorConfigExtra } from "@/features/generator-config-extras/presentations/GeneratorConfigExtra";
import { GeneratorConfigFormat } from "@/features/generator-config-formats/presentations/GeneratorConfigFormat";
import { GeneratorConfigQuantity } from "@/features/generator-config-quantities/presentations/GeneratorConfigQuantity";
import { Divider } from "@heroui/react";
import { FormProvider, useForm } from "react-hook-form";
import { GeneratorConfigFormValues } from "../types/generator-config";

export const GeneratorConfig = () => {
  const methods = useForm<GeneratorConfigFormValues>({
    defaultValues: {
      width: 512,
      height: 512,
      hires_fix: false,
      number_of_images: 4,
    },
  });

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-2">
        <GeneratorConfigFormat />
        <Divider />
        <GeneratorConfigExtra />
        <Divider />
        <GeneratorConfigQuantity />
      </div>
    </FormProvider>
  );
};
