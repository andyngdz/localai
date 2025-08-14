import { GeneratorConfigFormValues } from "@/features/generator-configs/types/generator-config";
import { Textarea } from "@heroui/input";
import { useFormContext } from "react-hook-form";

export const GeneratorPrompt = () => {
  const { register } = useFormContext<GeneratorConfigFormValues>();

  return (
    <div className="p-4">
      <div className="flex gap-4">
        <Textarea className="font-mono" label="Prompt" maxLength={1000} {...register("prompt")} />
        <Textarea
          className="font-mono"
          label="Negative prompt"
          maxLength={1000}
          {...register("negative_prompt")}
        />
      </div>
    </div>
  );
};
