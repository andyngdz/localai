import { Avatar } from '@heroui/react';
import { FC } from 'react';

export interface ModelWithAvatarProps {
  author: string;
  id: string;
}

export const ModelWithAvatar: FC<ModelWithAvatarProps> = ({ author, id }) => {
  return (
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
  );
};
