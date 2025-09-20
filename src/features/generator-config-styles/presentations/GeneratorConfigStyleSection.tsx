'use client'

import { StyleSection } from '@/types'
import { Card, CardBody, CardHeader } from '@heroui/react'
import { FC } from 'react'
import { GeneratorConfigStyleItem } from './GeneratorConfigStyleItem'

interface GeneratorConfigStyleSectionProps {
  styleSections: StyleSection[]
}

export const GeneratorConfigStyleSection: FC<
  GeneratorConfigStyleSectionProps
> = ({ styleSections }) => {
  return (
    <div className="flex flex-col gap-4">
      {styleSections.map((styleSection) => {
        return (
          <Card key={styleSection.id}>
            <CardHeader className="text-lg font-medium capitalize">
              {styleSection.id}
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {styleSection.styles.map((styleItem) => {
                  return (
                    <GeneratorConfigStyleItem
                      key={styleItem.id}
                      styleItem={styleItem}
                    />
                  )
                })}
              </div>
            </CardBody>
          </Card>
        )
      })}
    </div>
  )
}
