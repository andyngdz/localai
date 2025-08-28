import { GeneratorConfigFormValues } from '@/features/generator-configs'
import { ImageGenerationStepEndResponse } from '@/types'
import { Skeleton } from '@heroui/react'
import NextImage from 'next/image'
import { FC, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useGeneratorPreviewer } from '../states'

export interface GeneratorPreviewerItemProps {
  imageStepEnd: ImageGenerationStepEndResponse
}

export const GeneratorPreviewerItem: FC<GeneratorPreviewerItemProps> = ({ imageStepEnd }) => {
  const { watch } = useFormContext<GeneratorConfigFormValues>()
  const { items } = useGeneratorPreviewer()
  const width = watch('width')
  const height = watch('height')
  const aspectRatio = width / height

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

  return (
    <div
      className="relative self-start"
      style={{
        aspectRatio
      }}
    >
      {ImageComponent}
    </div>
  )
}
