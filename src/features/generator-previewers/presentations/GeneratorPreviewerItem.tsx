'use client'

import { useBackendUrl } from '@/cores/backend-initialization'
import { GeneratorConfigFormValues } from '@/features/generator-configs'
import { ImageGenerationStepEndResponse } from '@/types'
import { isEmpty } from 'es-toolkit/compat'
import { FC, useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useDownloadImages, useGeneratorPreviewer } from '../states'
import { GeneratorImageDownloadButton } from './GeneratorImageDownloadButton'
import { GeneratorImageRenderer } from './GeneratorImageRenderer'

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

  const hasImage = useMemo(
    () => !isEmpty(item.path) || !isEmpty(imageStepEnd.image_base64),
    [item.path, imageStepEnd.image_base64]
  )

  return (
    <div
      className="relative group h-full w-full"
      style={{
        aspectRatio
      }}
    >
      <GeneratorImageRenderer
        imagePath={item.path}
        imageBase64={imageStepEnd.image_base64}
        imageIndex={imageStepEnd.index}
        baseURL={baseURL}
      />
      {hasImage && (
        <GeneratorImageDownloadButton onDownload={onHandleDownloadImage} />
      )}
    </div>
  )
}
