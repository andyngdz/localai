import { ModelWithAvatar } from '@/cores/presentations/ModelWithAvatar';
import { formatter } from '@/services/formatter';
import { ModelDetailsResponse } from '@/types';
import { Chip, ScrollShadow } from '@heroui/react';
import { CircleArrowDown, CircleDashed, Heart, Package } from 'lucide-react';
import { FC } from 'react';

export interface ModelSearchViewCardProps {
  modelDetails: ModelDetailsResponse;
}

export const ModelSearchViewCard: FC<ModelSearchViewCardProps> = ({ modelDetails }) => {
  const { id, author, downloads, likes, tags } = modelDetails;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Package className="text-primary" />
        <span className="text-foreground-500 text-xl font-bold">Model Card</span>
      </div>
      <div className="flex flex-col gap-4">
        <ModelWithAvatar author={author} id={id} />
        <div className="flex items-center gap-4 text-foreground-500">
          <div className="flex items-center gap-2">
            <CircleDashed size={16} />
            <span className="text-xs">Text to Image</span>
          </div>
          <div className="flex items-center gap-2">
            <CircleArrowDown size={16} />
            <span className="text-xs">{formatter.number(downloads)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart size={16} />
            <span className="text-xs">{formatter.number(likes)}</span>
          </div>
        </div>
        <ScrollShadow className="flex gap-2" hideScrollBar orientation="horizontal">
          {tags.map((tag) => {
            return (
              <Chip variant="bordered" key={tag}>
                {tag}
              </Chip>
            );
          })}
        </ScrollShadow>
      </div>
    </div>
  );
};
