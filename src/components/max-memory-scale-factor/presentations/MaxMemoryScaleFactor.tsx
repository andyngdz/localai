"use client";

import { SetupLayout } from "@/components/layout/presentations/SetupLayout";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { MEMORY_OPTIONS } from "../constants";
import { MaxMemoryFormProps } from "../types";
import { MaxMemoryScaleFactorItem } from "./MaxMemoryScaleFactorItem";
import { MaxMemoryScaleFactorPreview } from "./MaxMemoryScaleFactorPreview";

export const MaxMemoryScaleFactor = () => {
  const router = useRouter();
  const methods = useForm<MaxMemoryFormProps>({
    defaultValues: { scaleFactor: 0.5 },
  });

  const onSubmit: SubmitHandler<MaxMemoryFormProps> = async (values) => {
    await api.setMaxMemory({
      gpu_scale_factor: values.scaleFactor,
      ram_scale_factor: values.scaleFactor,
    });

    router.push("/model-recommendations");
  };

  return (
    <FormProvider {...methods}>
      <SetupLayout
        title="Max Memory"
        description="Configure the maximum memory allocation for AI models"
        onNext={methods.handleSubmit(onSubmit)}
        onBack={router.back}
      >
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center gap-4">
            {MEMORY_OPTIONS.map((option) => (
              <MaxMemoryScaleFactorItem
                key={option.scaleFactor}
                option={option}
              />
            ))}
          </div>
          <div className="divider" />
          <MaxMemoryScaleFactorPreview />
        </div>
      </SetupLayout>
    </FormProvider>
  );
};
