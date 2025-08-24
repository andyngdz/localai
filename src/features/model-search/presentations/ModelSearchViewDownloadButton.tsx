import { Button } from '@heroui/react'
import { FC } from 'react'
import { useDownloadButton } from '../states'

export interface ModelSearchViewDownloadButtonProps {
  id: string
}

export const ModelSearchViewDownloadButton: FC<ModelSearchViewDownloadButtonProps> = ({ id }) => {
  const { onDownload } = useDownloadButton(id)

  return (
    <Button color="primary" className="text-background" onPress={onDownload}>
      Download this model
    </Button>
  )
}
