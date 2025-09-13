import { GeneratorConfigFormValues } from '@/features/generator-configs'
import { ImageGenerationStepEndResponse } from '@/types'
import { Button, Skeleton } from '@heroui/react'
import { Download } from 'lucide-react'
import NextImage from 'next/image'
import { FC, useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useDownloadImages, useGeneratorPreviewer } from '../states'

export interface GeneratorPreviewerItemProps {
  imageStepEnd: ImageGenerationStepEndResponse
}

export const GeneratorPreviewerItem: FC<GeneratorPreviewerItemProps> = ({ imageStepEnd }) => {
  const { onDownloadImage } = useDownloadImages()
  const { watch } = useFormContext<GeneratorConfigFormValues>()
  const { items } = useGeneratorPreviewer()
  const width = watch('width')
  const height = watch('height')
  const aspectRatio = width / height

  const onHandleDownloadImage = useCallback(() => {
    const item = items[imageStepEnd.index]
    const url = `http://localhost:8000/${item.path}`

    onDownloadImage(url)
  }, [imageStepEnd, items, onDownloadImage])

  const ImageComponent = useMemo(() => {
    const item = items[imageStepEnd.index]

    if (item.path.length > 0) {
      return (
        <NextImage
          src={`http://localhost:8000/${item.path}`}
          alt={`Image ${imageStepEnd.index}`}
          className="rounded-2xl object-cover"
          fill
        />
      )
    }

    if (imageStepEnd.image_base64.length === 0) {
      return <Skeleton className="rounded-2xl w-full h-full" />
    }

    const src = `data:image/png;base64,${imageStepEnd.image_base64}`

    return (
      <NextImage
        src={src}
        alt={`Image ${imageStepEnd.index}`}
        className="rounded-2xl object-cover"
        fill
      />
    )
  }, [imageStepEnd, items])

  const hasImage =
    items[imageStepEnd.index]?.path.length > 0 || imageStepEnd.image_base64.length > 0

  return (
    <div
      className="relative self-start group"
      style={{
        aspectRatio
      }}
    >
      {ImageComponent}
      {hasImage && (
        <Button
          isIconOnly
          size="sm"
          variant="solid"
          color="default"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onPress={onHandleDownloadImage}
          aria-label="Download image"
        >
          <Download size={16} />
        </Button>
      )}
    </div>
  )
}
