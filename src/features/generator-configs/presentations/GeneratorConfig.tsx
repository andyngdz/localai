import { GeneratorConfigExtra } from '@/features/generator-config-extras/presentations/GeneratorConfigExtra'
import { GeneratorConfigFormat } from '@/features/generator-config-formats/presentations/GeneratorConfigFormat'
import { GeneratorConfigQuantity } from '@/features/generator-config-quantities/presentations/GeneratorConfigQuantity'
import { GeneratorConfigSampling } from '@/features/generator-config-sampling/presentations/GeneratorConfigSampling'
import { GeneratorConfigSeed } from '@/features/generator-config-seed/presentations/GeneratorConfigSeed'
import { GeneratorConfigStyle } from '@/features/generator-config-styles/presentations/GeneratorConfigStyle'
import { Divider, ScrollShadow } from '@heroui/react'

export const GeneratorConfig = () => {
  return (
    <ScrollShadow className="h-full scrollable">
      <GeneratorConfigFormat />
      <Divider />
      <GeneratorConfigExtra />
      <Divider />
      <GeneratorConfigQuantity />
      <Divider />
      <GeneratorConfigSampling />
      <Divider />
      <GeneratorConfigSeed />
      <Divider />
      <GeneratorConfigStyle />
    </ScrollShadow>
  )
}
