import { useStyleSections } from "@/cores/hooks/useStyleSections";
import { GeneratorConfigFormValues } from "@/features/generator-configs/types/generator-config";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { GeneratorConfigStyleItem } from "./GeneratorConfigStyleItem";

export const GeneratorConfigStyleSelectedPreviewer = () => {
  const { watch } = useFormContext<GeneratorConfigFormValues>();
  const { styleItems } = useStyleSections();
  const styles = watch("styles", []);

  const SelectedStyleComponents = useMemo(() => {
    return styles.map((styleId) => {
      const styleItem = styleItems.find((s) => s.id === styleId);

      if (styleItem) return <GeneratorConfigStyleItem key={styleId} styleItem={styleItem} />;
    });
  }, [styles, styleItems]);

  return <div className="flex flex-wrap gap-2">{SelectedStyleComponents}</div>;
};
