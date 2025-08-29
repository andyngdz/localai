import { Accordion, AccordionItem, Spinner } from '@heroui/react'
import { HistoryGroup } from './HistoryGroup'
import { isEmpty } from 'es-toolkit/compat'
import { useHistories } from '../states'

export const Histories = () => {
  const { historyGroups, isLoading, error } = useHistories()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Failed to load histories</p>
      </div>
    )
  }

  if (isEmpty(historyGroups)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No histories found</p>
      </div>
    )
  }

  return (
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
  )
}
