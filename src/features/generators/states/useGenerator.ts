import { GeneratorConfigFormValues } from "@/features/generator-configs";
import { api } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler } from "react-hook-form";

export const useGenerator = () => {
  const { mutate } = useMutation({
    mutationKey: ["addHistory"],
    mutationFn: async (config: GeneratorConfigFormValues) => {
      return api.addHistory(config);
    },
    onSuccess() {},
    onError() {},
  });

  const onGenerate: SubmitHandler<GeneratorConfigFormValues> = (config) => {
    mutate(config);
  };

  return { onGenerate };
};
