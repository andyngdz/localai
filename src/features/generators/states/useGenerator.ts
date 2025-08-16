import { GeneratorConfigFormValues } from "@/features/generator-configs";
import { api } from "@/services/api";
import { ImageGenerationRequest } from "@/types";
import { addToast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler } from "react-hook-form";

export const useGenerator = () => {
  const { mutate: generateMutate } = useMutation({
    mutationKey: ["generator"],
    mutationFn: (request: ImageGenerationRequest) => {
      return api.generator(request);
    },
    onError() {
      addToast({
        title: "Something went wrong",
        description: "There was an error generating your image.",
        color: "danger",
      });
    },
  });

  const { mutate: addHistoryMutate } = useMutation({
    mutationKey: ["addHistory"],
    mutationFn: (config: GeneratorConfigFormValues) => {
      return api.addHistory(config);
    },
    onSuccess: (history_id: number, config: GeneratorConfigFormValues) => {
      addToast({
        title: "Added history",
        description: "Your generation has been added to history.",
        color: "success",
      });

      generateMutate({ history_id, config });
    },
    onError: () => {
      addToast({
        title: "Something went wrong",
        description: "There was an error adding your generation to history.",
        color: "danger",
      });
    },
  });

  const onGenerate: SubmitHandler<GeneratorConfigFormValues> = (config) => {
    mutate: addHistoryMutate(config);
  };

  return { onGenerate };
};
