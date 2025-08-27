import { HistoryItem } from '@/types'
import { useMemo } from 'react'

interface HistoryGroup {
  date: string
  histories: HistoryItem[]
}

export function useHistoryGroups(histories: HistoryItem[] | undefined): HistoryGroup[] {
  return useMemo(() => {
    if (!histories || histories.length === 0) {
      return []
    }

    const groups: Record<string, HistoryItem[]> = {}

    histories.forEach((history) => {
      // Extract date part from created_at (ISO string)
      const date = new Date(history.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      if (!groups[date]) {
        groups[date] = []
      }

      groups[date].push(history)
    })

    // Convert to array and sort by date (newest first)
    return Object.entries(groups)
      .map(([date, histories]) => ({ date, histories }))
      .sort((a, b) => {
        // Sort by date in descending order (newest first)
        const dateA = new Date(a.histories[0].created_at)
        const dateB = new Date(b.histories[0].created_at)
        return dateB.getTime() - dateA.getTime()
      })
  }, [histories])
}
