'use client'

import { StyleSection } from '@/types'
import { Card, CardBody, CardHeader, ScrollShadow } from '@heroui/react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { FC, useRef } from 'react'
import { GeneratorConfigStyleItem } from './GeneratorConfigStyleItem'

interface GeneratorConfigStyleSectionProps {
  styleSections: StyleSection[]
}

export const GeneratorConfigStyleSection: FC<
  GeneratorConfigStyleSectionProps
> = ({ styleSections }) => {
  const parentRef = useRef<HTMLDivElement>(null)

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: styleSections.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 2,
    measureElement: (element) => element.getBoundingClientRect().height
  })

  return (
    <ScrollShadow ref={parentRef} className="scrollbar-thin h-full">
      <div
        className="relative w-full"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const styleSection = styleSections[virtualItem.index]

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={rowVirtualizer.measureElement}
              className="absolute w-full pb-4"
              style={{
                transform: `translateY(${virtualItem.start}px)`
              }}
            >
              <Card shadow="sm">
                <CardHeader className="text-lg font-medium capitalize">
                  {styleSection.id}
                </CardHeader>
                <CardBody>
                  <div className="flex flex-wrap gap-2">
                    {styleSection.styles.map((styleItem) => (
                      <GeneratorConfigStyleItem
                        key={styleItem.id}
                        styleItem={styleItem}
                      />
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          )
        })}
      </div>
    </ScrollShadow>
  )
}
