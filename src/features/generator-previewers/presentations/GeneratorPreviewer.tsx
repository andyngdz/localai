import clsx from 'clsx'
import { useMemo } from 'react'
import { useImageViewModeStore } from '../states/useImageViewModeStore'
import { useGeneratorPreviewer } from '../states'
import { GeneratorPreviewerItem } from './GeneratorPreviewerItem'
import { GeneratorPreviewerSlider } from './GeneratorPreviewerSlider'

const GeneratorPreviewerGrid = () => {
  const { imageStepEnds } = useGeneratorPreviewer()

  const ImageComponents = useMemo(() => {
    return imageStepEnds.map((imageStepEnd) => {
      return <GeneratorPreviewerItem key={imageStepEnd.index} imageStepEnd={imageStepEnd} />
    })
  }, [imageStepEnds])

  return (
    <div
      className={clsx(
        'grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))]',
        'gap-4 p-4',
        'scrollbar-thin overflow-auto'
      )}
    >
      {ImageComponents}
    </div>
  )
}

export const GeneratorPreviewer = () => {
  const { viewMode } = useImageViewModeStore()

  if (viewMode === 'slider') {
    return <GeneratorPreviewerSlider />
  }

  return <GeneratorPreviewerGrid />
}
