import { Skeleton } from '@heroui/react'

export const HistoryLoader = () => {
  const items = Array.from({ length: 10 })

  return (
    <div className="flex flex-col" data-testid="history-loader">
      <div className="overflow-auto scrollbar-thin">
        <div className="flex flex-col gap-3 p-2">
          {items.map((_, idx) => (
            <div key={idx} className="border-2 border-default-300 rounded-2xl p-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <Skeleton className="h-4 w-16 rounded-md" />
                <Skeleton className="h-6 w-6 rounded-md" />
              </div>
              <Skeleton className="h-4 w-1/2 rounded-md mb-2" />
              <Skeleton className="h-5 w-4/5 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
