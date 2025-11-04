'use client'

import { useBackendUrl } from '@/cores/backend-initialization'
import { GeneratorConfigFormValues } from '@/features/generator-configs'
import { ImageGenerationStepEndResponse } from '@/types'
import { Button, Skeleton } from '@heroui/react'
import { isEmpty } from 'es-toolkit/compat'
import { Download } from 'lucide-react'
import NextImage from 'next/image'
import { FC, useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useDownloadImages, useGeneratorPreviewer } from '../states'

export interface GeneratorPreviewerItemProps {
  imageStepEnd: ImageGenerationStepEndResponse
}

export const GeneratorPreviewerItem: FC<GeneratorPreviewerItemProps> = ({
  imageStepEnd
}) => {
  const baseURL = useBackendUrl()
  const { onDownloadImage } = useDownloadImages()
  const { watch } = useFormContext<GeneratorConfigFormValues>()
  const { items } = useGeneratorPreviewer()
  const width = watch('width')
  const height = watch('height')
  const aspectRatio = width / height
  const item = items[imageStepEnd.index]

  const onHandleDownloadImage = useCallback(() => {
    const url = `${baseURL}/${item.path}`

    onDownloadImage(url)
  }, [baseURL, item.path, onDownloadImage])

  const ImageComponent = useMemo(() => {
    if (!isEmpty(item.path)) {
      return (
        <NextImage
          src={`${baseURL}/${item.path}`}
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
  }, [baseURL, imageStepEnd.image_base64, imageStepEnd.index, item.path])

  const hasImage = !isEmpty(item.path) || !isEmpty(imageStepEnd.image_base64)

  return (
    <div
      className="relative group h-full w-full"
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
