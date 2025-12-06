import { SLIDER_CONFIGS } from '../constants'
import { MaxMemoryScaleFactorItem } from './MaxMemoryScaleFactorItem'

export const MaxMemoryScaleFactorItems = () => {
  return (
    <div
      className="flex w-full flex-col gap-6"
      data-testid="memory-scale-factor-sliders"
    >
      {SLIDER_CONFIGS.map((config) => (
        <MaxMemoryScaleFactorItem key={config.fieldName} {...config} />
      ))}
    </div>
  )
}
