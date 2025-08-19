import { AuthorAvatar } from '@/cores/presentations/AuthorAvatar';
import { Button, Chip } from '@heroui/react';
import { split, take } from 'es-toolkit/compat';
import { Orbit } from 'lucide-react';
import { FC, useMemo, useState } from 'react';
import { ModelSearchViewHeader } from './ModelSearchViewHeader';

export interface ModelSearchViewSpacesProps {
  spaces: string[];
}

export const ModelSearchViewSpaces: FC<ModelSearchViewSpacesProps> = ({ spaces }) => {
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
      <ModelSearchViewHeader Icon={Orbit} title="Spaces" />
      <div className="flex flex-wrap gap-2">
        {showSpaces.map((space) => {
          return (
            <Chip
              variant="bordered"
              avatar={<AuthorAvatar id={split(space, '/')[0]} />}
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
