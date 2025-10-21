import { useModelRecommendationsQuery } from '@/cores/api-queries'
import { socket, SocketEvents } from '@/sockets'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'

export const useModelRecommendation = () => {
  const router = useRouter()
  const { data } = useModelRecommendationsQuery()

  const onNext = useCallback(() => {
    router.replace('/editor')
  }, [router])

  const onDownloadCompleted = useCallback(() => {
    router.replace('/editor')
  }, [router])

  useEffect(() => {
    socket.on(SocketEvents.DOWNLOAD_COMPLETED, onDownloadCompleted)

    return () => {
      socket.off(SocketEvents.DOWNLOAD_COMPLETED, onDownloadCompleted)
    }
  }, [onDownloadCompleted])

  return { onNext, data }
}
