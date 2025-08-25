import { StyleItem } from '@/types'
import { Avatar, Chip, Tooltip } from '@heroui/react'
import clsx from 'clsx'
import NextImage from 'next/image'
import { FC } from 'react'
import { useGeneratorConfigStyle } from '../states'

export interface GeneratorConfigStyleItemProps {
  styleItem: StyleItem
}

export const GeneratorConfigStyleItem: FC<GeneratorConfigStyleItemProps> = ({ styleItem }) => {
  const { isSelected, onClick } = useGeneratorConfigStyle(styleItem.id)

  return (
    <Tooltip
      key={styleItem.id}
      classNames={{
        content: 'p-0 rounded-lg overflow-hidden'
      }}
      content={
        <NextImage
          src={`http://localhost:8000/static/${styleItem.image}`}
          width={196}
          height={196}
          alt={styleItem.name}
        />
      }
    >
      <Chip
        avatar={
          <Avatar
            src={`http://localhost:8000/static/${styleItem.image}`}
            alt={styleItem.name}
            size="sm"
          />
        }
        variant="bordered"
        className={clsx('cursor-pointer transition-all', {
          'border-primary': isSelected
        })}
        onClick={onClick}
      >
        {styleItem.name}
      </Chip>
    </Tooltip>
  )
}
