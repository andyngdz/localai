import { useHistoriesQuery } from '@/services'
import { useHistoryGroups } from './useHistoryGroups'

export const useHistories = () => {
  const { data: histories = [], isLoading, error } = useHistoriesQuery()
  const historyGroups = useHistoryGroups(histories)

  return { historyGroups, isLoading, error }
}
