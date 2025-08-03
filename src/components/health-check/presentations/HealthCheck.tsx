"use client";

import { HealthCheckContentSuccess } from "./HealthCheckContentSuccess";
import { SetupLayout } from "../../layout/SetupLayout";
import { useHealthQuery } from "../../../services/queries";
import { useRouter } from "next/navigation";

export const HealthCheck = () => {
  const router = useRouter();
  const { data } = useHealthQuery();
  const isHealthy = data?.status === "ok" || data?.status === "healthy";

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
      <HealthCheckContentSuccess />
    </SetupLayout>
  );
};
