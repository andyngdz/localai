import { useMemoryQuery } from '@/cores/api-queries'
import { formatter } from '@/services'
import { useFormContext } from 'react-hook-form'
import { MaxMemoryFormProps } from '../types'

export const MaxMemoryScaleFactorPreview = () => {
  const { data } = useMemoryQuery()
  const { watch } = useFormContext<MaxMemoryFormProps>()
  const gpuScaleFactor = watch('gpuScaleFactor') ?? 0.5
  const ramScaleFactor = watch('ramScaleFactor') ?? 0.5

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
      <div className="flex flex-col gap-1 text-center">
        <div className="font-bold">
          GPU: {formatter.bytes(data.gpu * gpuScaleFactor)}
        </div>
        <div className="font-bold">
          RAM: {formatter.bytes(data.ram * ramScaleFactor)}
        </div>
      </div>
    </div>
  )
}
