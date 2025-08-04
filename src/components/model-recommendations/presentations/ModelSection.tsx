import { ModelRecommendationSection } from "@/types/api";
import { FC } from "react";
import { ModelCard } from "./ModelCard";
import { SectionHeader } from "./SectionHeader";

interface ModelSectionProps {
  section: ModelRecommendationSection;
  isDefaultRecommended: boolean;
}

export const ModelSection: FC<ModelSectionProps> = ({
  section,
  isDefaultRecommended,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title={section.name}
        description={section.description}
        isRecommended={section.is_recommended || isDefaultRecommended}
      />
      <div className="flex flex-col gap-4">
        {section.models.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>
    </div>
  );
};
