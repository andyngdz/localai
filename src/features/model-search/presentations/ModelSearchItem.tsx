import { formatter } from '@/services/formatter';
import { ModelSearchInfo } from '@/types';
import { Avatar, Card, CardBody, CardHeader } from '@heroui/react';
import { ArrowDownToLine, Heart } from 'lucide-react';
import { FC } from 'react';
export interface ModelSearchItemProps {
  modelSearchInfo: ModelSearchInfo;
}

export const ModelSearchItem: FC<ModelSearchItemProps> = ({ modelSearchInfo }) => {
  return (
    <Card className="max-w-96" isPressable>
      <CardHeader className="flex gap-3">
        <Avatar
          size="sm"
          radius="full"
          src={`http://localhost:8000/users/avatar/${modelSearchInfo.author}.png`}
          alt={modelSearchInfo.id}
          className="w-5 h-5"
          isBordered
        />
        <span className="text-sm text-left">{modelSearchInfo.id}</span>
      </CardHeader>
      <CardBody>
        <div className="flex gap-4 text-foreground-500">
          <div className="flex items-center gap-2">
            <ArrowDownToLine size={16} />
            <span className="text-xs">{formatter.number(modelSearchInfo.downloads)}</span>
          </div>
          <span className="flex items-center gap-2">
            <Heart size={16} />
            <span className="text-xs">{formatter.number(modelSearchInfo.likes)}</span>
          </span>
        </div>
      </CardBody>
    </Card>
  );
};
