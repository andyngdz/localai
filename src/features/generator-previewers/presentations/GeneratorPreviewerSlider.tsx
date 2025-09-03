import { useMemo } from 'react'
import { Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
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
      <SwiperSlide key={imageStepEnd.index}>
        <GeneratorPreviewerItem imageStepEnd={imageStepEnd} />
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
    <div className="p-4">
      <Swiper
        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
        spaceBetween={16}
        slidesPerView={2}
        pagination={{
          clickable: true,
          dynamicBullets: true
        }}
        keyboard={{
          enabled: true,
          onlyInViewport: true
        }}
        navigation
      >
        {ImageSlides}
      </Swiper>
    </div>
  )
}
