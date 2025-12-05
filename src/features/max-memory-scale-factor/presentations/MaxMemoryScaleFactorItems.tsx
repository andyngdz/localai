import { MaxMemoryScaleFactorItem } from './MaxMemoryScaleFactorItem'

const sliderConfigs = [
  {
    fieldName: 'gpuScaleFactor' as const,
    label: 'GPU allocation',
    description: 'Limit how much VRAM the pipeline can consume.'
  },
  {
    fieldName: 'ramScaleFactor' as const,
    label: 'RAM allocation',
    description: 'Limit how much system RAM background tasks may use.'
  }
]

export const MaxMemoryScaleFactorItems = () => {
  return (
    <div
      className="flex w-full flex-col gap-6"
      data-testid="memory-scale-factor-sliders"
    >
      {sliderConfigs.map((config) => (
        <MaxMemoryScaleFactorItem key={config.fieldName} {...config} />
      ))}
    </div>
  )
}
