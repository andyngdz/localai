import { Accordion, AccordionItem, Chip, Spinner } from '@heroui/react'
import { isEmpty } from 'es-toolkit/compat'
import { useHistories } from '../states'
import { HistoryGroup } from './HistoryGroup'

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
        <Chip color="danger">Failed to load histories</Chip>
      </div>
    )
  }

  if (isEmpty(historyGroups)) {
    return (
      <div className="flex items-center justify-center h-64">
        <Chip color="warning">No histories found</Chip>
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
