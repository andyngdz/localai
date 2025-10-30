'use client'

import 'swiper/css'
import 'swiper/css/pagination'

import { ModelRecommendationSection } from '@/types/api'
import { findIndex } from 'es-toolkit/compat'
import { FC } from 'react'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { ModelRecommendationsSection } from './ModelRecommendationsSection'

interface ModelRecommendationsListProps {
  sections: ModelRecommendationSection[]
  defaultSection: string
}

export const ModelRecommendationsList: FC<ModelRecommendationsListProps> = ({
  sections,
  defaultSection
}) => {
  const initialSlide = findIndex(sections, (s) => s.id === defaultSection)
  const sectionCount = sections.length
  const containerClass = sectionCount >= 2 ? 'max-w-3xl' : 'max-w-2xl'
  const slidesPerView = sectionCount === 1 ? 1 : 1.3

  return (
    <div className={containerClass}>
      <Swiper
        spaceBetween={16}
        slidesPerView={slidesPerView}
        modules={[Pagination]}
        pagination={{ clickable: true }}
        initialSlide={initialSlide}
        loop={sectionCount >= 2}
      >
        {sections.map((section) => {
          const { id } = section

          return (
            <SwiperSlide key={id} className="pb-8">
              <ModelRecommendationsSection
                section={section}
                isDefaultRecommended={id === defaultSection}
              />
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}
