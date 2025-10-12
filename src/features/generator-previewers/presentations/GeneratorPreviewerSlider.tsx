import { useMemo } from 'react'
import { Keyboard, Mousewheel } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useGeneratorPreviewer } from '../states'
import { GeneratorPreviewerItem } from './GeneratorPreviewerItem'

// Import Swiper styles
import 'swiper/css'
import { GeneratorPreviewerSliderActions } from './GeneratorPreviewerSliderActions'

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
      <div className="flex justify-center items-center text-default-700">
        No images to display
      </div>
    )
  }

  return (
    <div className="p-4 relative">
      <Swiper
        modules={[Mousewheel, Keyboard]}
        spaceBetween={16}
        slidesPerView={2}
        keyboard={{
          enabled: true,
          onlyInViewport: true
        }}
        loop
      >
        {ImageSlides}
        <GeneratorPreviewerSliderActions />
      </Swiper>
    </div>
  )
}
