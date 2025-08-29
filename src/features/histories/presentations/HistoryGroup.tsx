import { FC } from 'react'
import { HistoryItemContainer } from './HistoryItemContainer'
import { HistoryItem } from '@/types'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import { Clock } from 'lucide-react'

import 'react-vertical-timeline-component/style.min.css'
import '../styles/timeline.css'

interface HistoryGroupProps {
  histories: HistoryItem[]
}

export const HistoryGroup: FC<HistoryGroupProps> = ({ histories }) => {
  return (
    <VerticalTimeline layout="1-column" lineColor="hsl(var(--heroui-default-100) / 1)" animate>
      {histories.map((history) => {
        return (
          <VerticalTimelineElement
            key={history.id}
            icon={<Clock className="text-default-500" />}
            contentStyle={{ padding: '1rem', borderRadius: '1em' }}
          >
            <HistoryItemContainer history={history} />
          </VerticalTimelineElement>
        )
      })}
    </VerticalTimeline>
  )
}
