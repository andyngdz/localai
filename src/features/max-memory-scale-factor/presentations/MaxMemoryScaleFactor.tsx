'use client'

import { SetupLayout } from '@/features/setup-layout/presentations/SetupLayout'
import { api } from '@/services'
import { Divider } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { MaxMemoryFormProps } from '../types'
import { MaxMemoryScaleFactorItems } from './MaxMemoryScaleFactorItems'
import { MaxMemoryScaleFactorPreview } from './MaxMemoryScaleFactorPreview'

export const MaxMemoryScaleFactor = () => {
  const router = useRouter()
  const methods = useForm<MaxMemoryFormProps>({
    defaultValues: { scaleFactor: 0.5 }
  })

  const onSubmit: SubmitHandler<MaxMemoryFormProps> = async (values) => {
    await api.setMaxMemory({
      gpu_scale_factor: values.scaleFactor,
      ram_scale_factor: values.scaleFactor
    })

    router.push('/model-recommendations')
  }

  return (
    <FormProvider {...methods}>
      <SetupLayout
        title="Max Memory"
        description="Configure the maximum memory allocation for AI models"
        onNext={methods.handleSubmit(onSubmit)}
        onBack={router.back}
      >
        <div className="flex flex-col items-center gap-8">
          <MaxMemoryScaleFactorItems />
          <Divider />
          <MaxMemoryScaleFactorPreview />
        </div>
      </SetupLayout>
    </FormProvider>
  )
}
