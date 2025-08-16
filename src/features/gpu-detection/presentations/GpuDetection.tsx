'use client';

import { SetupLayout } from '@/features/layout/presentations/SetupLayout';
import { api } from '@/services/api';
import { useHardwareQuery } from '@/services/queries';
import { useRouter } from 'next/navigation';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { GpuDetectionFormProps } from '../types/gpu-detection';
import { GpuDetectionContent } from './GpuDetectionContent';

export const GpuDetection = () => {
  const methods = useForm<GpuDetectionFormProps>();
  const router = useRouter();

  const {
    formState: { isValid },
  } = methods;
  const { data } = useHardwareQuery();

  if (data) {
    const onSubmit: SubmitHandler<GpuDetectionFormProps> = async (values) => {
      await api.selectDevice({ device_index: values.gpu });
      router.push('/max-memory');
    };

    return (
      <FormProvider {...methods}>
        <SetupLayout
          title="GPU & Hardware Detection"
          description="Detecting your GPU and CUDA capabilities for optimal performance"
          onNext={methods.handleSubmit(onSubmit)}
          onBack={router.back}
          isNextDisabled={!isValid}
        >
          <GpuDetectionContent hardwareData={data} />
        </SetupLayout>
      </FormProvider>
    );
  }
};
