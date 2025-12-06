import { useMemoryQuery } from '@/cores/api-queries'
import { formatter } from '@/services'
import { useFormContext } from 'react-hook-form'
import { DEFAULT_SCALE_FACTOR } from '../constants'
import { MaxMemoryFormProps } from '../types'

export const MaxMemoryScaleFactorPreview = () => {
  const { data } = useMemoryQuery()
  const { watch } = useFormContext<MaxMemoryFormProps>()
  const gpuScaleFactor = watch('gpuScaleFactor') ?? DEFAULT_SCALE_FACTOR
  const ramScaleFactor = watch('ramScaleFactor') ?? DEFAULT_SCALE_FACTOR

  if (!data) {
    return (
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <p className="text-base-content/60">
            Select a memory option to see preview
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-center text-default-500">Memory Usage Preview</div>
      <div className="flex gap-2">
        <div className="font-bold">
          GPU: {formatter.bytes(data.gpu * gpuScaleFactor)}
        </div>
        <div>/</div>
        <div className="font-bold">
          RAM: {formatter.bytes(data.ram * ramScaleFactor)}
        </div>
      </div>
    </div>
  )
}
