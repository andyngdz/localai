import { Alert, Progress, ScrollShadow } from '@heroui/react'
import { isEmpty } from 'es-toolkit/compat'
import { useModelSearch } from '../states'
import { ModelSearchItem } from './ModelSearchItem'

export const ModelSearchListModel = () => {
  const { data, isLoading } = useModelSearch()

  if (isLoading) {
    return (
      <Progress
        isIndeterminate
        aria-label="Loading..."
        className="max-w-md"
        size="sm"
      />
    )
  }

  if (data) {
    const { models_search_info } = data

    if (isEmpty(models_search_info)) {
      return (
        <Alert className="grow-0" color="warning">
          No models found
        </Alert>
      )
    }

    return (
      <ScrollShadow>
        <div className="flex flex-col gap-2 p-2">
          {models_search_info.map((model) => (
            <ModelSearchItem key={model.id} modelSearchInfo={model} />
          ))}
        </div>
      </ScrollShadow>
    )
  }
}
