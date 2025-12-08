'use client'

import {
  MemoryScaleFactorItems,
  MemoryScaleFactorPreview
} from '@/cores/presentations/memory-scale-factor'
import { SetupLayout } from '@/features/setup-layout/presentations/SetupLayout'
import { api } from '@/services'
import { Divider } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { MaxMemoryFormProps } from '../types'

export const MaxMemoryScaleFactor = () => {
  const router = useRouter()
  const { handleSubmit, setValue, control } = useForm<MaxMemoryFormProps>({
    defaultValues: { gpuScaleFactor: 0.5, ramScaleFactor: 0.5 }
  })

  const gpuScaleFactor = useWatch({
    name: 'gpuScaleFactor',
    control
  })
  const ramScaleFactor = useWatch({
    name: 'ramScaleFactor',
    control
  })

  const onSubmit: SubmitHandler<MaxMemoryFormProps> = async (values) => {
    await api.setMaxMemory({
      gpu_scale_factor: values.gpuScaleFactor,
      ram_scale_factor: values.ramScaleFactor
    })

    router.push('/model-recommendations')
  }

  return (
    <SetupLayout
      title="Max Memory"
      description="Configure the maximum memory allocation for AI models"
      onNext={handleSubmit(onSubmit)}
      onBack={router.back}
    >
      <div className="flex flex-col items-center gap-8">
        <MemoryScaleFactorItems
          gpuScaleFactor={gpuScaleFactor}
          ramScaleFactor={ramScaleFactor}
          onGpuChange={(value) => setValue('gpuScaleFactor', Number(value))}
          onRamChange={(value) => setValue('ramScaleFactor', Number(value))}
        />
        <Divider />
        <MemoryScaleFactorPreview
          gpuScaleFactor={gpuScaleFactor}
          ramScaleFactor={ramScaleFactor}
        />
      </div>
    </SetupLayout>
  )
}
