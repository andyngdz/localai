'use client'

import {
  DownloadModelStartResponse,
  DownloadStepProgressResponse,
  SocketEvents,
  useSocketEvent
} from '@/sockets'
import { useQueryClient } from '@tanstack/react-query'
import { FC, PropsWithChildren, useCallback } from 'react'
import { useDownloadWatcherStore } from '../states'

export const DownloadWatcher: FC<PropsWithChildren> = ({ children }) => {
  const queryClient = useQueryClient()
  const { onUpdateStep, onSetId, onResetStep, onResetId } =
    useDownloadWatcherStore()

  // Handle download start event
  const handleDownloadStart = useCallback(
    (data: DownloadModelStartResponse) => {
      onSetId(data.id)
    },
    [onSetId]
  )

  // Handle download progress event
  const handleDownloadProgress = useCallback(
    (step: DownloadStepProgressResponse) => {
      onUpdateStep(step)
    },
    [onUpdateStep]
  )

  // Handle download completed event
  const handleDownloadCompleted = useCallback(() => {
    onResetStep()
    onResetId()
    queryClient.invalidateQueries({
      queryKey: ['getDownloadedModels']
    })
  }, [onResetStep, onResetId, queryClient])

  // Subscribe to socket events using the new hook
  useSocketEvent(SocketEvents.DOWNLOAD_START, handleDownloadStart, [
    handleDownloadStart
  ])
  useSocketEvent(SocketEvents.DOWNLOAD_STEP_PROGRESS, handleDownloadProgress, [
    handleDownloadProgress
  ])
  useSocketEvent(SocketEvents.DOWNLOAD_COMPLETED, handleDownloadCompleted, [
    handleDownloadCompleted
  ])

  return children
}
