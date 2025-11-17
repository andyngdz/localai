import { useImageViewModeStore } from '../states/useImageViewModeStore'
import { GeneratorPreviewerGrid } from './GeneratorPreviewerGrid'
import { GeneratorPreviewerSlider } from './GeneratorPreviewerSlider'

export const GeneratorPreviewer = () => {
  const { viewMode } = useImageViewModeStore()

  if (viewMode === 'slider') {
    return <GeneratorPreviewerSlider />
  }

  return <GeneratorPreviewerGrid />
}
