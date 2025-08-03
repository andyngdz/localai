"use client";

import { SetupLayout } from "@/components/layout/presentations/SetupLayout";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MEMORY_OPTIONS } from "../constants";
import { MemoryOptionItem } from "./MemoryOptionItem";

export const MaxMemory = () => {
  const router = useRouter();
  const [selectedMemory, setSelectedMemory] = useState<number>(50);

  const handleMemorySelect = (value: number) => {
    setSelectedMemory(value);
  };

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
            <MemoryOptionItem
              key={option.value}
              option={option}
              isSelected={selectedMemory === option.value}
              onSelect={() => handleMemorySelect(option.value)}
            />
          ))}
        </div>
        {/* <MemoryPreview selectedValue={selectedMemory} totalMemory={16} /> */}
      </div>
    </SetupLayout>
  );
};
