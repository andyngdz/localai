import { Listbox, ListboxItem, Button, Spinner } from '@heroui/react'
import { Trash2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'

export const ModelManagement = () => {
  // Fetch models
  const { data: models = [], isLoading } = useQuery({
    queryKey: ['getDownloadedModels'],
    queryFn: async () => {
      const modelsDownloaded = await api.getDownloadedModels()
      return modelsDownloaded
    }
  })

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
            endContent={
              <Button isIconOnly variant="light" color="danger">
                <Trash2 size={16} />
              </Button>
            }
          >
            {model.model_id}
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  )
}
