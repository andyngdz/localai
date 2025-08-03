import { FC } from "react";
import type { HardwareResponse } from "../../../types/api";
import { GpuDetectionCpuModeOnly } from "./GpuDectectionCpuModeOnly";
import { GpuDetectionVersion } from "./GpuDetectionVersion";
import { GpuDetectionItem } from "./GpuDetectionItem";

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
        <div className="rounded-lg bg-base-300">
          {is_cuda && (
            <GpuDetectionVersion
              cuda_runtime_version={cuda_runtime_version}
              nvidia_driver_version={nvidia_driver_version}
            />
          )}
        </div>
        <div className="rounded-lg bg-base-300 p-4">
          {hardwareData.gpus.map((gpu, index) => {
            return <GpuDetectionItem key={index} gpu={gpu} index={index} />;
          })}
        </div>
        {!is_cuda && <GpuDetectionCpuModeOnly />}
      </div>
    );
  }
};
