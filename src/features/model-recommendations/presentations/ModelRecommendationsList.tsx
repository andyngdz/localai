'use client';

import 'swiper/css';
import 'swiper/css/pagination';

import { ModelRecommendationSection } from '@/types/api';
import { findIndex } from 'es-toolkit/compat';
import { FC } from 'react';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ModelRecommendationsSection } from './ModelRecommendationsSection';

interface ModelRecommendationsListProps {
  sections: ModelRecommendationSection[];
  defaultSection: string;
}

export const ModelRecommendationsList: FC<ModelRecommendationsListProps> = ({
  sections,
  defaultSection,
}) => {
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
      </Swiper>
    </div>
  );
};
