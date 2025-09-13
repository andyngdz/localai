import { Accordion, AccordionItem } from '@heroui/react'
import { isEmpty } from 'es-toolkit/compat'
import { useHistories } from '../states'
import { HistoryEmpty } from './HistoryEmpty'
import { HistoryErrors } from './HistoryErrors'
import { HistoryGroup } from './HistoryGroup'
import { HistoryLoader } from './HistoryLoader'

export const Histories = () => {
  const { historyGroups, isLoading, error } = useHistories()

  if (isLoading) {
    return <HistoryLoader />
  }

  if (error) {
    return <HistoryErrors error={error} />
  }

  if (isEmpty(historyGroups)) {
    return <HistoryEmpty />
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-auto scrollbar-thin">
        <Accordion className="w-full">
          {historyGroups.map((group) => (
            <AccordionItem
              key={group.date}
              title={group.date}
              aria-label={`History group for ${group.date}`}
              classNames={{
                title: 'text-sm text-default-500 font-semibold'
              }}
            >
              <HistoryGroup key={group.date} histories={group.histories} />
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
