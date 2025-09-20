import NothingHereYet from '@/assets/planet.png'
import NextImage from 'next/image'

export const HistoryEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center h-96 p-4 gap-2">
      <NextImage
        src={NothingHereYet}
        alt="Nothing here yet"
        width={96}
        height={96}
      />
      <div className="font-semibold">No histories found</div>
      <div className="text-default-500 text-sm text-center">
        Generate new images and your history will appear here
      </div>
    </div>
  )
}
