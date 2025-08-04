"use client";

import { SetupLayout } from "@/components/layout/presentations/SetupLayout";
import { useModelRecommendationsQuery } from "@/services/queries";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ModelRecommendationFormProps } from "../types";
import { ModelRecommendationsList } from "./ModelRecommendationsList";

export const ModelRecommendations = () => {
  const router = useRouter();
  const { data } = useModelRecommendationsQuery();
  const methods = useForm<ModelRecommendationFormProps>({
    defaultValues: {
      selectedModel: "",
    },
  });
  const { watch, setValue } = methods;
  const selectedModel = watch("selectedModel");

  useEffect(() => {
    if (data?.default_selected_model && !selectedModel) {
      setValue("selectedModel", data.default_selected_model);
    }
  }, [data, selectedModel, setValue]);

  const onSubmit: SubmitHandler<ModelRecommendationFormProps> = (values) => {
    console.log("Selected model:", values.selectedModel);
  };

  return (
    <SetupLayout
      title="Model Recommendations"
      description="Choose an AI model that fits your hardware capabilities and performance needs"
      onNext={methods.handleSubmit(onSubmit)}
      onBack={router.back}
    >
      <FormProvider {...methods}>
        <ModelRecommendationsList
          sections={data?.sections || []}
          defaultRecommendSection={data?.default_recommend_section || ""}
        />
      </FormProvider>
    </SetupLayout>
  );
};
