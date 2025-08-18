import { formatter } from '@/services/formatter';
import { ModelDetailsResponse } from '@/types';
import { Avatar, Chip, ScrollShadow } from '@heroui/react';
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
        <div className="flex items-center gap-3">
          <Avatar
            size="sm"
            radius="full"
            src={`http://localhost:8000/users/avatar/${author}.png`}
            alt={id}
            className="w-4 h-4"
            isBordered
          />
          <span className="text-left text-sm">{id}</span>
        </div>
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
