import { GeneratorConfigFormValues } from "@/features/generator-configs";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler } from "react-hook-form";

export const useGenerator = () => {
  const {} = useMutation({
    mutationKey: ["addHistory"],
    mutationFn: async () => {},
  });

  const onGenerate: SubmitHandler<GeneratorConfigFormValues> = (config) => {
    console.info(config);
  };

  return { onGenerate };
};
