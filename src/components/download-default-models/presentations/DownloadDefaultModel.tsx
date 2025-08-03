"use client";

import { SetupLayout } from "@/components/layout/presentations/SetupLayout";
import { useRouter } from "next/navigation";

export const DownloadDefaultModel = () => {
  const router = useRouter();

  return (
    <SetupLayout
      title="Download Default Model"
      description="Download the default model configuration"
      onNext={() => {}}
      onBack={router.back}
    >
      <div></div>
    </SetupLayout>
  );
};
