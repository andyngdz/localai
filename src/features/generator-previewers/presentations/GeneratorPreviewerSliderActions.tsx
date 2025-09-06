import { Button } from '@heroui/react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useSwiper } from 'swiper/react'

export const GeneratorPreviewerSliderActions = () => {
  const swiper = useSwiper()

  const onPrevious = () => {
    swiper.slidePrev()
  }

  const onNext = () => {
    swiper.slideNext()
  }

  return (
    <div className="absolute inset-4 z-20 flex items-center justify-between">
      <Button
        isIconOnly
        variant="flat"
        color="default"
        onPress={onPrevious}
        className="z-10"
        aria-label="Previous image"
      >
        <ChevronLeftIcon />
      </Button>
      <Button
        isIconOnly
        variant="flat"
        color="default"
        onPress={onNext}
        className="z-10"
        aria-label="Next image"
      >
        <ChevronRightIcon />
      </Button>
    </div>
  )
}
