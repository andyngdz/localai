"use client";
import "swiper/css";
import "swiper/css/pagination";

import { ModelRecommendationSection } from "@/types/api";
import { FC } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ModelRecommendationsSection } from "./ModelRecommendationsSection";

interface ModelRecommendationsListProps {
  sections: ModelRecommendationSection[];
  defaultRecommendSection: string;
}

export const ModelRecommendationsList: FC<ModelRecommendationsListProps> = ({
  sections,
  defaultRecommendSection,
}) => {
  return (
    <div className="max-w-2xl">
      <Swiper
        spaceBetween={16}
        slidesPerView="auto"
        modules={[Pagination]}
        pagination={{ clickable: true }}
        loop
      >
        {sections.map((section) => (
          <SwiperSlide key={section.id} className="max-w-4/5 pb-8">
            <ModelRecommendationsSection
              section={section}
              isDefaultRecommended={section.id === defaultRecommendSection}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
