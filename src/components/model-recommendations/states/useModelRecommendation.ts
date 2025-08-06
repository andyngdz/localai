import { api } from "@/services/api";
import { useModelRecommendationsQuery } from "@/services/queries";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ModelRecommendationFormProps } from "../types";

export const useModelRecommendation = () => {
  const methods = useForm<ModelRecommendationFormProps>();
  const { data } = useModelRecommendationsQuery();
  const { setValue } = methods;

  const onSubmit: SubmitHandler<ModelRecommendationFormProps> = async (
    values
  ) => {
    const id = values.id;

    if (id) {
      await api.downloadModel(id);
    }
  };

  useEffect(() => {
    if (data) {
      setValue("id", data.default_selected_id);
    }
  }, [data, setValue]);

  return { methods, onSubmit, data };
};
