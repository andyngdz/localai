"use client";

import { Chip } from "@heroui/react";
import { FC } from "react";
import { modelTagService } from "../services/model_tag";

interface ModelRecommendationsTagsProps {
  tags: string[];
}

export const ModelRecommendationsTags: FC<ModelRecommendationsTagsProps> = ({
  tags,
}) => {
  return (
    <section className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <Chip
          key={tag}
          color={modelTagService.getChipColor(index)}
          className="font-medium text-xs"
        >
          {tag}
        </Chip>
      ))}
    </section>
  );
};
