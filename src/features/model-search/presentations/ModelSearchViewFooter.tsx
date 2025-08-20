import { api } from '@/services/api';
import { Button } from '@heroui/react';
import { Info } from 'lucide-react';
import { FC } from 'react';

export interface ModelSearchViewFooterProps {
  id: string;
}

export const ModelSearchViewFooter: FC<ModelSearchViewFooterProps> = ({ id }) => {
  const onDownload = () => {
    api.downloadModel(id);
  };

  return (
    <div className="p-4 border-t border-divider">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-foreground-500">
          <Info size={16} />
          <span className="text-xs">
            Optimized download: Only essential files are downloaded, saving space
          </span>
        </div>
        <Button color="primary" className="text-background" size="sm" onPress={onDownload}>
          Download this model
        </Button>
      </div>
    </div>
  );
};
