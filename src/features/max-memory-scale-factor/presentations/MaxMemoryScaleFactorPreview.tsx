import { formatter, useMemoryQuery } from '@/services'
import { useFormContext } from 'react-hook-form'
import { MaxMemoryFormProps } from '../types'

export const MaxMemoryScaleFactorPreview = () => {
  const { data } = useMemoryQuery()
  const { watch } = useFormContext<MaxMemoryFormProps>()
  const scaleFactor = watch('scaleFactor')

  if (!data) {
    return (
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <p className="text-base-content/60">Select a memory option to see preview</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-center text-default-500">Memory Usage Preview</div>
      <div className="flex gap-2">
        <div className="font-bold">GPU: {formatter.bytes(data.gpu * scaleFactor)}</div>
        <div>/</div>
        <div className="font-bold">RAM: {formatter.bytes(data.ram * scaleFactor)}</div>
      </div>
    </div>
  )
}
