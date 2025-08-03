"use client";

import { SetupLayout } from "@/components/layout/presentations/SetupLayout";
import { useRouter } from "next/navigation";
import { MEMORY_OPTIONS } from "../constants/constant";
import { MaxMemoryScaleFactorItem } from "./MaxMemoryScaleFactorItem";

export const MaxMemoryScaleFactor = () => {
  const router = useRouter();

  const onNext = () => {};

  return (
    <SetupLayout
      title="Max Memory"
      description="Configure the maximum memory allocation for AI models"
      onNext={onNext}
      onBack={router.back}
    >
      <div>
        <div className="flex flex-col items-center gap-4">
          {MEMORY_OPTIONS.map((option) => (
            <MaxMemoryScaleFactorItem key={option.value} option={option} />
          ))}
        </div>
        {/* <MemoryPreview selectedValue={selectedMemory} totalMemory={16} /> */}
      </div>
    </SetupLayout>
  );
};
