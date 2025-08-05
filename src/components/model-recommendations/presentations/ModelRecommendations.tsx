"use client";

import { SetupLayout } from "@/components/layout/presentations/SetupLayout";
import { useModelRecommendationsQuery } from "@/services/queries";
import { useRouter } from "next/navigation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ModelRecommendationFormProps } from "../types";
import { ModelRecommendationsList } from "./ModelRecommendationsList";

export const ModelRecommendations = () => {
  const router = useRouter();
  const { data } = useModelRecommendationsQuery();
  const methods = useForm<ModelRecommendationFormProps>();

  const onSubmit: SubmitHandler<ModelRecommendationFormProps> = (values) => {
    console.log("Selected model:", values.selectedModel);
  };

  return (
    <FormProvider {...methods}>
      <SetupLayout
        title="Model Recommendations"
        description="Choose an AI model that fits your hardware capabilities and performance needs"
        onNext={methods.handleSubmit(onSubmit)}
        onBack={router.back}
      >
        <ModelRecommendationsList
          sections={data?.sections || []}
          defaultRecommendSection={data?.default_recommend_section || ""}
        />
      </SetupLayout>
    </FormProvider>
  );
};
