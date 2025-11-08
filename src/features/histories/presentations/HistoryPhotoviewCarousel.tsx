'use client'

import 'swiper/css'

import { useHistoriesQuery } from '@/cores/api-queries'
import { Button } from '@heroui/react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { FC, useMemo } from 'react'
import { Keyboard, Mousewheel } from 'swiper/modules'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { HistoryPhotoviewCard } from './HistoryPhotoviewCard'

interface HistoryPhotoviewCarouselProps {
  currentHistoryId: number | null
}

interface HistoryPhotoviewNavigationProps {
  shouldShow: boolean
}

const HistoryPhotoviewNavigation: FC<HistoryPhotoviewNavigationProps> = ({
  shouldShow
}) => {
  const swiper = useSwiper()

  if (!shouldShow) {
    return null
  }

  return (
    <div className="absolute inset-4 flex items-center justify-between pointer-events-none">
      <Button
        isIconOnly
        variant="flat"
        color="default"
        onPress={() => swiper.slidePrev()}
        className="z-10 pointer-events-auto"
        aria-label="Previous history"
      >
        <ChevronLeftIcon />
      </Button>
      <Button
        isIconOnly
        variant="flat"
        color="default"
        onPress={() => swiper.slideNext()}
        className="z-10 pointer-events-auto"
        aria-label="Next history"
      >
        <ChevronRightIcon />
      </Button>
    </div>
  )
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
      <HistoryPhotoviewNavigation shouldShow={hasMultipleHistories} />
    </Swiper>
  )
}
