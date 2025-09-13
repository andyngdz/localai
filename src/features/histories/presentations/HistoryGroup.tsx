import { HistoryItem } from '@/types'
import { FC } from 'react'
import { HistoryItemContainer } from './HistoryItemContainer'

import 'react-vertical-timeline-component/style.min.css'

interface HistoryGroupProps {
  histories: HistoryItem[]
}

export const HistoryGroup: FC<HistoryGroupProps> = ({ histories }) => {
  return (
    <div className="flex flex-col gap-4 overflow-auto scrollbar-thin">
      {histories.map((history) => {
        return <HistoryItemContainer key={history.id} history={history} />
      })}
    </div>
  )
}
