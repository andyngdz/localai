import { ModelWithAvatar } from '@/cores/presentations/ModelWithAvatar'
import { formatter } from '@/services'
import { Chip, ScrollShadow } from '@heroui/react'
import { CircleArrowDown, CircleDashed, Heart, Package } from 'lucide-react'
import { FC } from 'react'
import { ModelSearchViewHeader } from './ModelSearchViewHeader'

export interface ModelSearchViewCardProps {
  id: string
  author: string
  downloads: number
  likes: number
  tags: string[]
}

export const ModelSearchViewCard: FC<ModelSearchViewCardProps> = ({
  id,
  author,
  downloads,
  likes,
  tags
}) => {
  return (
    <div className="flex flex-col gap-6">
      <ModelSearchViewHeader
        Icon={Package}
        title="Model Card"
        href={`https://huggingface.co/${id}`}
      />
      <div className="flex flex-col gap-4">
        <ModelWithAvatar author={author} id={id} />
        <div className="flex items-center gap-4 text-default-500">
          <div className="flex items-center gap-2">
            <CircleDashed size={16} />
            <span className="text-xs">Text to Image</span>
          </div>
          <div className="flex items-center gap-2">
            <CircleArrowDown size={16} />
            <span className="text-xs">{formatter.number(downloads)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart size={16} />
            <span className="text-xs">{formatter.number(likes)}</span>
          </div>
        </div>
        <ScrollShadow className="flex gap-2" hideScrollBar orientation="horizontal">
          {tags.map((tag) => {
            return (
              <Chip variant="bordered" key={tag}>
                {tag}
              </Chip>
            )
          })}
        </ScrollShadow>
      </div>
    </div>
  )
}
