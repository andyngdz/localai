import { FC, ReactNode } from 'react';

export interface ModelRecommendationMemoryBoxProps {
  icon: ReactNode;
  content: string;
}

export const ModelRecommendationMemoryBox: FC<ModelRecommendationMemoryBoxProps> = ({
  icon,
  content,
}) => {
  return (
    <div className="w-24 flex items-center gap-2">
      <span className="text-muted-content">{icon}</span>
      <span className="text-sm font-bold text-base-content">{content}</span>
    </div>
  );
};
