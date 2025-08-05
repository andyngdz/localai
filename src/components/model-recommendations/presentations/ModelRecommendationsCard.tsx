"use client";

import { ModelRecommendationItem } from "@/types/api";
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
  const { register, watch } = useFormContext<ModelRecommendationFormProps>();
  const selectedModel = watch("selectedModel");
  const isSelected = selectedModel === model.id;

  return (
    <label
      className={clsx(
        "card cursor-pointer transition-all border-2 border-neutral",
        {
          "bg-primary/10 border-primary": isSelected,
          "hover:border-primary/50": !isSelected,
        }
      )}
    >
      <div className="card-body p-4">
        <div className="flex items-center gap-4">
          <input
            type="radio"
            value={model.id}
            className="radio radio-primary"
            {...register("selectedModel", { required: true })}
          />
          <div className="flex flex-col gap-2 flex-1">
            <section className="flex justify-between items-center">
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
      </div>
    </label>
  );
};
