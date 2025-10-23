import { SocketEvents, useSocketEvent } from '@/cores/sockets'
import { useCallback } from 'react'
import { useMessageStore } from './useMessageStores'

export const useStreamingMessage = () => {
  const { message, reset } = useMessageStore()

  const handleModelLoadCompleted = useCallback(() => {
    reset()
  }, [reset])

  const handleDownloadCompleted = useCallback(() => {
    reset()
  }, [reset])

  useSocketEvent(SocketEvents.MODEL_LOAD_COMPLETED, handleModelLoadCompleted, [
    handleModelLoadCompleted
  ])

  useSocketEvent(SocketEvents.DOWNLOAD_COMPLETED, handleDownloadCompleted, [
    handleDownloadCompleted
  ])

  return { message }
}
