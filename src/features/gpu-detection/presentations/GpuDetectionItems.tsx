import { GpuInfo } from "@/types";
import { Card, RadioGroup } from "@heroui/react";
import { FC, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { GpuDetectionFormProps } from "../types/gpu-detection";
import { GpuDetectionItem } from "./GpuDetectionItem";

export interface GpuDetectionItemsProps {
  gpus: GpuInfo[];
}

export const GpuDetectionItems: FC<GpuDetectionItemsProps> = ({ gpus }) => {
  const { setValue } = useFormContext<GpuDetectionFormProps>();
  const defaultValue = gpus.findIndex((g) => g.is_primary);

  const items = useMemo(() => {
    return gpus.map((gpu, index) => {
      return <GpuDetectionItem key={index} gpu={gpu} value={`${index}`} />;
    });
  }, [gpus]);

  return (
    <Card>
      <RadioGroup
        defaultValue={`${defaultValue}`}
        onChange={(event) => {
          setValue("gpu", event.target.value);
        }}
      >
        {items}
      </RadioGroup>
    </Card>
  );
};
