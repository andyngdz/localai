"use client";

import "swiper/css";
import "swiper/css/pagination";

import { ModelRecommendationSection } from "@/types/api";
import { RadioGroup } from "@heroui/react";
import { findIndex } from "es-toolkit/compat";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ModelRecommendationFormProps } from "../types";
import { ModelRecommendationsSection } from "./ModelRecommendationsSection";

interface ModelRecommendationsListProps {
  sections: ModelRecommendationSection[];
  defaultSection: string;
}

export const ModelRecommendationsList: FC<ModelRecommendationsListProps> = ({
  sections,
  defaultSection,
}) => {
  const { setValue } = useFormContext<ModelRecommendationFormProps>();
  const initialSlide = findIndex(sections, (s) => s.id === defaultSection);

  return (
    <div className="max-w-2xl">
      <Swiper
        spaceBetween={16}
        slidesPerView="auto"
        modules={[Pagination]}
        pagination={{ clickable: true }}
        initialSlide={initialSlide}
        loop
      >
        <RadioGroup
          onValueChange={(id) => {
            setValue("id", id);
          }}
        >
          {sections.map((section) => {
            const { id } = section;

            return (
              <SwiperSlide key={id} className="max-w-4/5 pb-8">
                <ModelRecommendationsSection
                  section={section}
                  isDefaultRecommended={id === defaultSection}
                />
              </SwiperSlide>
            );
          })}
        </RadioGroup>
      </Swiper>
    </div>
  );
};
