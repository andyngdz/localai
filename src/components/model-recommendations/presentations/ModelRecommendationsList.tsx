import { ModelRecommendationSection } from "@/types/api";
import { FC } from "react";
import { ModelRecommendationsSection } from "./ModelRecommendationsSection";

interface ModelRecommendationsListProps {
  sections: ModelRecommendationSection[];
  defaultRecommendSection: string;
}

export const ModelRecommendationsList: FC<ModelRecommendationsListProps> = ({
  sections,
  defaultRecommendSection,
}) => {
  return (
    <div className="flex flex-col gap-8">
      {sections.map((section) => (
        <ModelRecommendationsSection
          key={section.id}
          section={section}
          isDefaultRecommended={section.id === defaultRecommendSection}
        />
      ))}
    </div>
  );
};
