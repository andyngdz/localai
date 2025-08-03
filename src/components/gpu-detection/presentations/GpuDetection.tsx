"use client";

import { SetupLayout } from "../../layout/SetupLayout";
import { GpuDetectionContent } from "./GpuDetectionContent";
import { useHardwareQuery } from "../../../services/queries";
import { FormProvider, useForm } from "react-hook-form";

interface GpuDetectionProps {
  onNext?: VoidFunction;
  onBack?: VoidFunction;
}

export function GpuDetection({ onBack }: GpuDetectionProps) {
  const methods = useForm();
  const { data, isLoading: isHardwareLoading } = useHardwareQuery();

  if (data) {
    const isLoading = isHardwareLoading;
    const isCudaAvailable = data.is_cuda;
    const canProceed = !isLoading && (isCudaAvailable || data);

    const onSubmit = () => {};

    return (
      <FormProvider {...methods}>
        <SetupLayout
          title="GPU & Hardware Detection"
          description="Detecting your GPU and CUDA capabilities for optimal performance"
          onNext={methods.handleSubmit(onSubmit)}
          onBack={onBack}
          isNextDisabled={!canProceed}
        >
          <GpuDetectionContent hardwareData={data} />
        </SetupLayout>
      </FormProvider>
    );
  }
}
