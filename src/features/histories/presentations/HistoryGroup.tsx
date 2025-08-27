import { HistoryItemContainer } from './HistoryItemContainer'
import { ImageGenerationItem } from '@/types/image-generations'
import { HistoryItem } from '@/types'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'
import { Clock } from 'lucide-react'

interface HistoryGroupProps {
  histories: HistoryItem[]
  images?: Record<number, ImageGenerationItem[]>
}

export function HistoryGroup({ histories, images = {} }: HistoryGroupProps) {
  return (
    <div className="w-full h-full">
      <VerticalTimeline
        animate={true}
        lineColor="#e5e7eb" // gray-200 in Tailwind
        layout="1-column"
      >
        {histories.map((history) => {
          const timeString = new Date(history.created_at).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })

          return (
            <VerticalTimelineElement
              key={history.id}
              className="vertical-timeline-element"
              date={timeString}
              dateClassName="text-sm text-gray-500"
              iconStyle={{ background: '#f3f4f6', color: '#6b7280' }}
              icon={<Clock className="w-4 h-4" />}
              contentStyle={{ padding: '1rem', borderRadius: '0.5rem' }}
            >
              <HistoryItemContainer history={history} images={images[history.id] || []} />
            </VerticalTimelineElement>
          )
        })}
      </VerticalTimeline>
    </div>
  )
}
