import { DownloadStepProgressResponse, socket, SocketEvents } from '@/sockets'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export const useModelDownloadStatusLine = () => {
  const queryClient = useQueryClient()
  const [percent, setPercent] = useState(0.0)

  useEffect(() => {
    socket.on(SocketEvents.DOWNLOAD_STEP_PROGRESS, (data: DownloadStepProgressResponse) => {
      setPercent(data.step / data.total)
    })

    socket.on(SocketEvents.DOWNLOAD_COMPLETED, () => {
      setPercent(0.0)
      queryClient.invalidateQueries({
        queryKey: ['downloaded-models']
      })
    })

    return () => {
      socket.off(SocketEvents.DOWNLOAD_STEP_PROGRESS)
      socket.off(SocketEvents.DOWNLOAD_COMPLETED)
    }
  }, [queryClient])

  return {
    percent
  }
}
