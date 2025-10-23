'use client'

import { useModelSelectorStore } from '@/features/model-selectors/states'
import {
  DownloadModelStartResponse,
  DownloadStepProgressResponse,
  SocketEvents,
  useSocketEvent
} from '@/sockets'
import { ModelDownloaded } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { isEmpty } from 'es-toolkit/compat'
import { FC, PropsWithChildren, useCallback } from 'react'
import { useDownloadWatcherStore } from '../states'

export const DownloadWatcher: FC<PropsWithChildren> = ({ children }) => {
  const queryClient = useQueryClient()
  const { onUpdateStep, onSetId, onResetStep, onResetId } =
    useDownloadWatcherStore()
  const { selected_model_id, setSelectedModelId } = useModelSelectorStore()

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

    // Auto-select first model if this is the user's first download
    const downloadedModels =
      queryClient.getQueryData<ModelDownloaded[]>(['getDownloadedModels']) || []

    if (downloadedModels.length === 1 && isEmpty(selected_model_id)) {
      setSelectedModelId(downloadedModels[0].model_id)
    }
  }, [
    onResetStep,
    onResetId,
    queryClient,
    selected_model_id,
    setSelectedModelId
  ])

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
