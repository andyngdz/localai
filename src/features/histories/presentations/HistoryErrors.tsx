import { ApiError } from '@/types'
import { FC } from 'react'

export interface HistoryErrorsProps {
  error: ApiError
}

export const HistoryErrors: FC<HistoryErrorsProps> = ({ error }) => {
  return (
    <div className="flex flex-col items-center justify-center h-96 p-4 gap-2">
      <div className="font-semibold text-danger">Error loading history</div>
      <div className="text-default-500 text-sm text-center">
        {error.message}
      </div>
    </div>
  )
}
