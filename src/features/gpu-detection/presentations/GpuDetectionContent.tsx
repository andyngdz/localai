"use client";

import { Card, RadioGroup } from "@heroui/react";
import { FC } from "react";
import type { HardwareResponse } from "../../../types/api";
import { GpuDetectionCpuModeOnly } from "./GpuDetectionCpuModeOnly";
import { GpuDetectionItem } from "./GpuDetectionItem";
import { GpuDetectionVersion } from "./GpuDetectionVersion";

interface GpuDetectionContentProps {
  hardwareData: HardwareResponse;
}

export const GpuDetectionContent: FC<GpuDetectionContentProps> = ({
  hardwareData,
}) => {
  if (hardwareData) {
    const { is_cuda, cuda_runtime_version, nvidia_driver_version } =
      hardwareData;

    return (
      <div className="flex flex-col gap-4">
        {is_cuda && (
          <GpuDetectionVersion
            cuda_runtime_version={cuda_runtime_version}
            nvidia_driver_version={nvidia_driver_version}
          />
        )}
        <Card>
          <RadioGroup>
            {hardwareData.gpus.map((gpu, index) => {
              return (
                <GpuDetectionItem key={index} gpu={gpu} value={`${index}`} />
              );
            })}
          </RadioGroup>
        </Card>
        {!is_cuda && <GpuDetectionCpuModeOnly />}
      </div>
    );
  }
};
