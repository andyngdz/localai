import { StyleSection } from '@/types'
import { FC } from 'react'
import { GeneratorConfigStyleItem } from './GeneratorConfigStyleItem'

interface GeneratorConfigStyleSectionProps {
  styleSections: StyleSection[]
}

export const GeneratorConfigStyleSection: FC<GeneratorConfigStyleSectionProps> = ({
  styleSections
}) => {
  return styleSections.map((styleSection) => {
    return (
      <div key={styleSection.id} className="flex flex-col gap-2">
        <span className="text-lg font-medium capitalize bg-content2 p-2">{styleSection.id}</span>
        <div className="flex flex-wrap gap-2 p-2">
          {styleSection.styles.map((styleItem) => {
            return <GeneratorConfigStyleItem key={styleItem.id} styleItem={styleItem} />
          })}
        </div>
      </div>
    )
  })
}
