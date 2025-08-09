import clsx from "clsx";
import { FC } from "react";
import { ModelRecommendationsBadge } from "./ModelRecommendationsBadge";

interface ModelRecommendationsHeaderProps {
  title: string;
  description: string;
  isRecommended: boolean;
}

export const ModelRecommendationsHeader: FC<ModelRecommendationsHeaderProps> = ({
  title,
  description,
  isRecommended,
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <h3
          className={clsx(
            "text-xl font-bold",
            isRecommended ? "text-primary" : "text-base-content"
          )}
        >
          {title}
        </h3>
        {isRecommended && <ModelRecommendationsBadge />}
      </div>
      <span className="text-muted-content leading-relaxed">{description}</span>
    </div>
  );
};
