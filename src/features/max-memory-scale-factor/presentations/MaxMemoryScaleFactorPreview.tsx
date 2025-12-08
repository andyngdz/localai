import { useConfig } from '@/cores/hooks'
import { formatter } from '@/services'
import { useFormContext } from 'react-hook-form'
import { DEFAULT_SCALE_FACTOR } from '../constants'
import { MaxMemoryFormProps } from '../types'

export const MaxMemoryScaleFactorPreview = () => {
  const { total_gpu_memory, total_ram_memory } = useConfig()
  const { watch } = useFormContext<MaxMemoryFormProps>()
  const gpuScaleFactor = watch('gpuScaleFactor') ?? DEFAULT_SCALE_FACTOR
  const ramScaleFactor = watch('ramScaleFactor') ?? DEFAULT_SCALE_FACTOR

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-center text-default-500">Memory Usage Preview</div>
      <div className="flex gap-2">
        <div className="font-bold">
          GPU: {formatter.bytes(total_gpu_memory * gpuScaleFactor)}
        </div>
        <div>/</div>
        <div className="font-bold">
          RAM: {formatter.bytes(total_ram_memory * ramScaleFactor)}
        </div>
      </div>
    </div>
  )
}
