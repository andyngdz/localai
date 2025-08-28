import { dateFormatter } from '@/services'
import { HistoryItem } from '@/types'
import { isEmpty } from 'es-toolkit/compat'
import { useMemo } from 'react'

export interface HistoryGroup {
  date: string
  histories: HistoryItem[]
}

export const useHistoryGroups = (histories: HistoryItem[]): HistoryGroup[] => {
  return useMemo(() => {
    if (isEmpty(histories)) {
      return []
    }

    const groups: Record<string, HistoryItem[]> = {}

    const historiesSorted = histories.reverse()

    historiesSorted.forEach((history) => {
      const date = dateFormatter.date(history.created_at)
      if (!groups[date]) {
        groups[date] = []
      }

      groups[date].push(history)
    })

    return Object.entries(groups).map(([date, histories]) => ({ date, histories }))
  }, [histories])
}
