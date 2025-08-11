import { GeneratorConfigExtra } from "@/features/generator-config-extras/presentations/GeneratorConfigExtra";
import { GeneratorConfigFormat } from "@/features/generator-config-formats/presentations/GeneratorConfigFormat";
import { GeneratorConfigQuantity } from "@/features/generator-config-quantities/presentations/GeneratorConfigQuantity";
import { GeneratorConfigSampling } from "@/features/generator-config-sampling/presentations/GeneratorConfigSampling";
import { GeneratorConfigSeed } from "@/features/generator-config-seed/presentations/GeneratorConfigSeed";
import { GeneratorConfigStyle } from "@/features/generator-config-styles/presentations/GeneratorConfigStyle";
import { Divider } from "@heroui/react";
import { FormProvider, useForm } from "react-hook-form";
import { GeneratorConfigFormValues } from "../types/generator-config";

export const GeneratorConfig = () => {
  const methods = useForm<GeneratorConfigFormValues>({
    mode: "onChange",
    defaultValues: {
      width: 512,
      height: 512,
      hires_fix: false,
      number_of_images: 4,
      steps: 24,
      seed: -1,
      cfg_scale: 7.5,
    },
  });

  return (
    <div className="h-full overflow-auto">
      <FormProvider {...methods}>
        <GeneratorConfigFormat />
        <Divider />
        <GeneratorConfigExtra />
        <Divider />
        <GeneratorConfigQuantity />
        <Divider />
        <GeneratorConfigSampling />
        <Divider />
        <GeneratorConfigSeed />
        <Divider />
        <GeneratorConfigStyle />
      </FormProvider>
    </div>
  );
};
