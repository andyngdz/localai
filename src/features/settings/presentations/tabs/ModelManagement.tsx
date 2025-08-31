import { useDownloadedModels } from '@/features/settings/states/useDownloadedModels'
import { Listbox, ListboxItem, Spinner } from '@heroui/react'
import { DeleteModelButton } from './DeleteModelButton'

export const ModelManagement = () => {
  // Fetch models
  const { data: models = [], isLoading } = useDownloadedModels()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Installed Models</h3>
      <Listbox aria-label="Models list">
        {models.map((model) => (
          <ListboxItem
            key={model.model_id}
            endContent={<DeleteModelButton model_id={model.model_id} />}
          >
            {model.model_id}
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  )
}
