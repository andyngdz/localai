import { Button } from '@heroui/react';
import { Info } from 'lucide-react';

export const ModelSearchViewFooter = () => {
  return (
    <div className="p-4 border-t border-divider">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-foreground-500">
          <Info size={16} />
          <span className="text-xs">
            Optimized download: Only essential files are downloaded, saving space
          </span>
        </div>
        <Button color="primary" className="text-background" size="sm">
          Download this model
        </Button>
      </div>
    </div>
  );
};
