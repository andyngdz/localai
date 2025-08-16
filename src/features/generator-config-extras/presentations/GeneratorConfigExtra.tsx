import { Button } from '@heroui/react';
import { Plus } from 'lucide-react';

export const GeneratorConfigExtra = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm">Extra</span>
        <Button variant="light" aria-label="Add Extra" isIconOnly>
          <Plus />
        </Button>
      </div>
    </div>
  );
};
