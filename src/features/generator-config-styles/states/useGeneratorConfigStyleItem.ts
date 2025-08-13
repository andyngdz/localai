import { GeneratorConfigFormValues } from "@/features/generator-configs/types/generator-config";
import { useFormContext } from "react-hook-form";

export const useGeneratorConfigStyle = (styleId: string) => {
  const { setValue, watch } = useFormContext<GeneratorConfigFormValues>();
  const styles = watch("styles", []);
  const isSelected = styles.includes(styleId);

  const onClick = () => {
    if (isSelected) {
      setValue(
        "styles",
        styles.filter((id) => id !== styleId)
      );
    } else {
      setValue("styles", [...styles, styleId]);
    }
  };

  return { isSelected, onClick };
};
