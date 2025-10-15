'use client'

import {
  DownloadModelStartResponse,
  DownloadStepProgressResponse,
  socket,
  SocketEvents
} from '@/sockets'
import { useQueryClient } from '@tanstack/react-query'
import { FC, PropsWithChildren, useEffect } from 'react'
import { useDownloadWatcherStore } from '../states'

export const DownloadWatcher: FC<PropsWithChildren> = ({ children }) => {
  const queryClient = useQueryClient()
  const { onUpdateStep, onSetId, onResetStep, onResetId } =
    useDownloadWatcherStore()

  useEffect(() => {
    socket.on(
      SocketEvents.DOWNLOAD_START,
      (data: DownloadModelStartResponse) => {
        onSetId(data.id)
      }
    )

    socket.on(
      SocketEvents.DOWNLOAD_STEP_PROGRESS,
      (step: DownloadStepProgressResponse) => {
        onUpdateStep(step)
      }
    )

    socket.on(SocketEvents.DOWNLOAD_COMPLETED, () => {
      onResetStep()
      onResetId()
      queryClient.invalidateQueries({
        queryKey: ['getDownloadedModels']
      })
    })

    return () => {
      socket.off(SocketEvents.DOWNLOAD_START)
      socket.off(SocketEvents.DOWNLOAD_STEP_PROGRESS)
      socket.off(SocketEvents.DOWNLOAD_COMPLETED)
    }
  }, [queryClient, onSetId, onUpdateStep, onResetStep, onResetId])

  return children
}
