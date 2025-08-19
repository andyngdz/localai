import { Avatar, Button, Chip } from '@heroui/react';
import { take } from 'es-toolkit/compat';
import { Orbit } from 'lucide-react';
import { FC, useMemo, useState } from 'react';

export interface ModelSearchViewSpacesProps {
  id: string;
  spaces: string[];
}

export const ModelSearchViewSpaces: FC<ModelSearchViewSpacesProps> = ({ id, spaces }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const showMoreText = isExpanded ? 'Show less' : 'Show more';

  const showSpaces = useMemo(() => {
    if (isExpanded) {
      return spaces;
    }
    return take(spaces, 5);
  }, [isExpanded, spaces]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Orbit className="text-primary" />
        <span className="text-foreground-500 text-lg font-bold">Spaces are using {id}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {showSpaces.map((space) => {
          return (
            <Chip
              variant="bordered"
              avatar={
                <Avatar src={`http://localhost:8000/users/avatar/${space.split('/')[0]}.png`} />
              }
              key={space}
            >
              <span>{space}</span>
            </Chip>
          );
        })}
        <Button
          onPress={() => setIsExpanded((prev) => !prev)}
          className="h-7"
          variant="bordered"
          color="warning"
          radius="full"
          size="sm"
        >
          {showMoreText}
        </Button>
      </div>
    </div>
  );
};
