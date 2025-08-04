import clsx from "clsx";
import { FC } from "react";
import { modelTagService } from "../services/model_tag";

interface ModelRecommendationsTagsProps {
  tags: string[];
}

export const ModelRecommendationsTags: FC<ModelRecommendationsTagsProps> = ({
  tags,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span
          key={tag}
          className={clsx(
            "badge badge-sm font-medium text-xs",
            modelTagService.getTagVariant(index)
          )}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};
