import { Accordion, AccordionItem, Spinner } from '@heroui/react'
import { useHistoriesQuery } from '@/services/queries'
import { useHistoryGroups } from '../states/useHistoryGroups'
import { HistoryGroup } from './HistoryGroup'

export const Histories = () => {
  const { data: histories, isLoading, error } = useHistoriesQuery()
  const historyGroups = useHistoryGroups(histories)

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

  if (!histories || histories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No histories found</p>
      </div>
    )
  }

  return (
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
  )
}
