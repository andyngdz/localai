"use client";

import { useRouter } from "next/navigation";
import { useHealthQuery } from "../../../services/queries";
import { SetupLayout } from "../../layout/presentations/SetupLayout";
import { HealthCheckContent } from "./HealthCheckContent";

export const HealthCheck = () => {
  const router = useRouter();
  const { data } = useHealthQuery();
  const isHealthy = !!data;

  console.info(isHealthy);

  const onNext = () => {
    if (isHealthy) {
      router.push("/gpu-detection");
    }
  };

  return (
    <SetupLayout
      title="Health Check"
      description="Checking the connection to your LocalAI backend server"
      onNext={onNext}
      isNextDisabled={!isHealthy}
    >
      <HealthCheckContent isHealthy={isHealthy} />
    </SetupLayout>
  );
};
