import clsx from 'clsx'
import { useMemo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules'
import { useGeneratorPreviewer } from '../states'
import { GeneratorPreviewerItem } from './GeneratorPreviewerItem'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export const GeneratorPreviewerSlider = () => {
  const { imageStepEnds } = useGeneratorPreviewer()

  const ImageSlides = useMemo(() => {
    return imageStepEnds.map((imageStepEnd) => (
      <SwiperSlide key={imageStepEnd.index} className="flex justify-center items-center">
        <div className="w-full max-w-2xl">
          <GeneratorPreviewerItem imageStepEnd={imageStepEnd} />
        </div>
      </SwiperSlide>
    ))
  }, [imageStepEnds])

  if (imageStepEnds.length === 0) {
    return (
      <div className="flex justify-center items-center h-96 text-gray-500">
        No images to display
      </div>
    )
  }

  return (
    <div className={clsx('w-full h-full p-4')}>
      <Swiper
        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{
          clickable: true,
          dynamicBullets: true
        }}
        mousewheel={{
          forceToAxis: true,
          sensitivity: 0.1
        }}
        keyboard={{
          enabled: true,
          onlyInViewport: true
        }}
        loop={imageStepEnds.length > 1}
        centeredSlides
        className={clsx(
          'h-full w-full',
          '[&_.swiper-button-next]:text-white [&_.swiper-button-prev]:text-white',
          '[&_.swiper-button-next]:scale-75 [&_.swiper-button-prev]:scale-75',
          '[&_.swiper-pagination-bullet]:bg-white [&_.swiper-pagination-bullet]:opacity-50',
          '[&_.swiper-pagination-bullet-active]:opacity-100'
        )}
      >
        {ImageSlides}
      </Swiper>
    </div>
  )
}
