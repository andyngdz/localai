import { Info } from 'lucide-react'
import { FC } from 'react'
import { ModelSearchViewDownloadButton } from './ModelSearchViewDownloadButton'

export interface ModelSearchViewFooterProps {
  id: string
}

export const ModelSearchViewFooter: FC<ModelSearchViewFooterProps> = ({ id }) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-foreground-500">
          <Info size={16} />
          <span className="text-xs">
            Optimized download: Only essential files are downloaded, saving space
          </span>
        </div>
        <ModelSearchViewDownloadButton id={id} />
      </div>
    </div>
  )
}
