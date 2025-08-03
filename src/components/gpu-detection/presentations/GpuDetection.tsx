"use client";

import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useHardwareQuery } from "../../../services/queries";
import { SetupLayout } from "../../layout/SetupLayout";
import { GpuDetectionForm } from "../types/gpu-detection";
import { GpuDetectionContent } from "./GpuDetectionContent";

export const GpuDetection = () => {
  const methods = useForm<GpuDetectionForm>();
  const router = useRouter();
  const { data, isLoading: isHardwareLoading } = useHardwareQuery();

  if (data) {
    const isLoading = isHardwareLoading;
    const isCudaAvailable = data.is_cuda;
    const canProceed = !isLoading && (isCudaAvailable || data);

    const onSubmit: SubmitHandler<GpuDetectionForm> = async (values) => {
      await api.selectDevice({ device_index: values.gpu });
      router.push("/max-memory");
    };

    return (
      <FormProvider {...methods}>
        <SetupLayout
          title="GPU & Hardware Detection"
          description="Detecting your GPU and CUDA capabilities for optimal performance"
          onNext={methods.handleSubmit(onSubmit)}
          onBack={router.back}
          isNextDisabled={!canProceed}
        >
          <GpuDetectionContent hardwareData={data} />
        </SetupLayout>
      </FormProvider>
    );
  }
};
