import clsx from "clsx";
import { FC } from "react";
import { RecommendedBadge } from "./RecommendedBadge";

interface SectionHeaderProps {
  title: string;
  description: string;
  isRecommended: boolean;
}

export const SectionHeader: FC<SectionHeaderProps> = ({
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
        {isRecommended && <RecommendedBadge />}
      </div>
      <span className="text-base-content/80 leading-relaxed">
        {description}
      </span>
    </div>
  );
};
