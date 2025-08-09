"use client";

import { ModelRecommendationItem } from "@/types/api";
import { Card } from "@heroui/react";
import clsx from "clsx";
import { Cpu, HardDrive } from "lucide-react";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { ModelRecommendationFormProps } from "../types";
import { ModelRecommendationMemoryBox } from "./ModelRecommendationMemoryBox";
import { ModelRecommendationsBadge } from "./ModelRecommendationsBadge";
import { ModelRecommendationsTags } from "./ModelRecommendationsTags";

interface ModelRecommendationsCardProps {
  model: ModelRecommendationItem;
}

export const ModelRecommendationsCard: FC<ModelRecommendationsCardProps> = ({
  model,
}) => {
  const { watch, setValue } = useFormContext<ModelRecommendationFormProps>();
  const id = watch("id");
  const isSelected = id === model.id;

  return (
    <Card
      className={clsx("p-4 border-2 border-foreground/10 transition-all", {
        "bg-primary/10 border-primary": isSelected,
        "hover:border-primary/50": !isSelected,
      })}
      onPress={() => setValue("id", model.id)}
      isPressable
    >
      <div className="flex items-center gap-4 w-full">
        <div className="flex flex-col gap-2 flex-1">
          <section className="flex justify-between">
            <div className="flex items-center gap-2">
              <h4
                className={clsx(
                  "font-bold text-lg",
                  isSelected ? "text-primary" : "text-base-content"
                )}
              >
                {model.name}
              </h4>
              {model.is_recommended && <ModelRecommendationsBadge />}
            </div>
            <ModelRecommendationMemoryBox
              icon={<HardDrive />}
              content={model.model_size}
            />
          </section>
          <section className="flex justify-between">
            <span className="text-muted-content">{model.description}</span>
            <ModelRecommendationMemoryBox
              icon={<Cpu />}
              content={`${model.memory_requirement_gb} GB`}
            />
          </section>
          <ModelRecommendationsTags tags={model.tags} />
        </div>
      </div>
    </Card>
  );
};
