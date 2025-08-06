import { api } from "@/services/api";
import { useModelRecommendationsQuery } from "@/services/queries";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ModelRecommendationFormProps } from "../types";

export const useModelRecommendation = () => {
  const { data } = useModelRecommendationsQuery();
  const methods = useForm<ModelRecommendationFormProps>();
  const { watch, setValue } = methods;
  const selectedModel = watch("selectedModel");

  const onSubmit: SubmitHandler<ModelRecommendationFormProps> = async (
    values
  ) => {
    const id = values.selectedModel;

    if (id) {
      await api.downloadModel(id);
    }
  };

  useEffect(() => {
    if (data && !selectedModel) {
      setValue("selectedModel", data.default_selected_model);
    }
  }, [data, selectedModel, setValue]);

  return { methods, onSubmit, data };
};
