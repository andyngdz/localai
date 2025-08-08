"use client";

import { ModelRecommendationSection } from "@/types/api";
import { FC } from "react";
import { ModelRecommendationsCard } from "./ModelRecommendationsCard";
import { ModelRecommendationsHeader } from "./ModelRecommendationsHeader";

interface ModelRecommendationsSectionProps {
  section: ModelRecommendationSection;
  isDefaultRecommended: boolean;
}

export const ModelRecommendationsSection: FC<
  ModelRecommendationsSectionProps
> = ({ section, isDefaultRecommended }) => {
  return (
    <div className="flex flex-col gap-4">
      <ModelRecommendationsHeader
        title={section.name}
        description={section.description}
        isRecommended={section.is_recommended || isDefaultRecommended}
      />

      {section.models.map((model) => (
        <ModelRecommendationsCard key={model.id} model={model} />
      ))}
    </div>
  );
};
