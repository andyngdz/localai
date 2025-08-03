"use client";

import { SetupLayout } from "@/components/layout/presentations/SetupLayout";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { MEMORY_OPTIONS } from "../constants";
import { MaxMemoryFormProps } from "../types";
import { MaxMemoryScaleFactorItem } from "./MaxMemoryScaleFactorItem";
import { MaxMemoryScaleFactorPreview } from "./MaxMemoryScaleFactorPreview";

export const MaxMemoryScaleFactor = () => {
  const methods = useForm<MaxMemoryFormProps>({
    defaultValues: { scaleFactor: 0.5 },
  });
  const router = useRouter();

  const onNext = () => {};

  return (
    <FormProvider {...methods}>
      <SetupLayout
        title="Max Memory"
        description="Configure the maximum memory allocation for AI models"
        onNext={onNext}
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
