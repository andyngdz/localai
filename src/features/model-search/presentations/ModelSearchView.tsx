import { useModelSearchView } from '../states/useModelSearchView'

import { useDownloadWatcher } from '@/features/download-watcher'
import { ModelDownloadStatusLine } from '@/features/model-download-status-line'
import { ScrollShadow } from '@heroui/react'
import { useModelSearchSelectorStore } from '../states'
import { ModelSearchViewCard } from './ModelSearchViewCard'
import { ModelSearchViewFiles } from './ModelSearchViewFiles'
import { ModelSearchViewFooter } from './ModelSearchViewFooter'
import { ModelSearchViewSpaces } from './ModelSearchViewSpaces'

export const ModelSearchView = () => {
  const { model_id } = useModelSearchSelectorStore()
  const { modelDetails } = useModelSearchView(model_id)
  const { isDownloading } = useDownloadWatcher(model_id)

  if (modelDetails) {
    return (
      <div className="flex flex-col gap-2 h-full">
        <ScrollShadow className="flex flex-col gap-8 p-6">
          <ModelSearchViewCard
            author={modelDetails.author}
            downloads={modelDetails.downloads}
            id={modelDetails.id}
            likes={modelDetails.likes}
            tags={modelDetails.tags}
          />
          <ModelSearchViewSpaces spaces={modelDetails.spaces} />
          <ModelSearchViewFiles
            id={modelDetails.id}
            siblings={modelDetails.siblings}
          />
        </ScrollShadow>
        <div className="flex flex-col">
          {isDownloading && <ModelDownloadStatusLine id={modelDetails.id} />}
          <ModelSearchViewFooter id={modelDetails.id} />
        </div>
      </div>
    )
  }
}
