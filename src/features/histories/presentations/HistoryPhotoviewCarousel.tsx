'use client'

import 'swiper/css'

import { useHistoriesQuery } from '@/cores/api-queries'
import { SwiperNavigationActions } from '@/cores/presentations'
import { FC, useMemo } from 'react'
import { Keyboard, Mousewheel } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { HistoryPhotoviewCard } from './HistoryPhotoviewCard'

interface HistoryPhotoviewCarouselProps {
  currentHistoryId: number | null
}

export const HistoryPhotoviewCarousel: FC<HistoryPhotoviewCarouselProps> = ({
  currentHistoryId
}) => {
  const { data: histories = [] } = useHistoriesQuery()

  const initialSlide = useMemo(() => {
    if (currentHistoryId === null) return 0
    const index = histories.findIndex((h) => h.id === currentHistoryId)
    return index === -1 ? 0 : index
  }, [currentHistoryId, histories])

  const slides = useMemo(() => {
    return histories.map((history) => (
      <SwiperSlide key={history.id} className="h-full">
        <HistoryPhotoviewCard history={history} />
      </SwiperSlide>
    ))
  }, [histories])

  const hasMultipleHistories = histories.length > 1

  if (histories.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-default-500">
        No history items to display
      </div>
    )
  }

  return (
    <Swiper
      modules={[Mousewheel, Keyboard]}
      slidesPerView={1}
      spaceBetween={24}
      keyboard={{
        enabled: true,
        onlyInViewport: true
      }}
      initialSlide={initialSlide}
      className="h-full w-full"
      loop={hasMultipleHistories}
      style={{ width: '100%', overflow: 'hidden' }}
    >
      {slides}
      {hasMultipleHistories && (
        <SwiperNavigationActions
          previousLabel="Previous history"
          nextLabel="Next history"
        />
      )}
    </Swiper>
  )
}
