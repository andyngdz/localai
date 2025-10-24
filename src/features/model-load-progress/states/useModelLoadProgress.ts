import {
  ModelLoadProgressResponse,
  ModelLoadStartedResponse,
  SocketEvents,
  useSocketEvent
} from '@/cores/sockets'
import { useCallback } from 'react'
import { useModelLoadProgressStore } from './useModelLoadProgressStore'

export const useModelLoadProgress = () => {
  const { id, progress, onUpdateProgress, onSetId, reset } =
    useModelLoadProgressStore()

  const onLoadStarted = useCallback(
    (data: ModelLoadStartedResponse) => {
      onSetId(data.id)
    },
    [onSetId]
  )

  const onLoadProgress = useCallback(
    (data: ModelLoadProgressResponse) => {
      onUpdateProgress(data)
    },
    [onUpdateProgress]
  )

  const onLoadCompleted = useCallback(() => {
    reset()
  }, [reset])

  useSocketEvent(SocketEvents.MODEL_LOAD_STARTED, onLoadStarted, [
    onLoadStarted
  ])
  useSocketEvent(SocketEvents.MODEL_LOAD_PROGRESS, onLoadProgress, [
    onLoadProgress
  ])
  useSocketEvent(SocketEvents.MODEL_LOAD_COMPLETED, onLoadCompleted, [
    onLoadCompleted
  ])

  const percentage = progress
    ? Math.round((progress.step / progress.total) * 100)
    : 0

  return {
    isLoading: !!id,
    message: progress?.message || 'Loading model...',
    percentage
  }
}
