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
  const { onUpdatePercent, onSetId } = useDownloadWatcherStore()

  useEffect(() => {
    socket.on(
      SocketEvents.DOWNLOAD_START,
      (data: DownloadModelStartResponse) => {
        onSetId(data.id)
      }
    )

    socket.on(
      SocketEvents.DOWNLOAD_STEP_PROGRESS,
      (data: DownloadStepProgressResponse) => {
        const { id, step, total } = data

        onUpdatePercent(step / total)
        onSetId(id)
      }
    )

    socket.on(SocketEvents.DOWNLOAD_COMPLETED, () => {
      onUpdatePercent(0.0)
      onSetId('')
      queryClient.invalidateQueries({
        queryKey: ['getDownloadedModels']
      })
    })

    return () => {
      socket.off(SocketEvents.DOWNLOAD_START)
      socket.off(SocketEvents.DOWNLOAD_STEP_PROGRESS)
      socket.off(SocketEvents.DOWNLOAD_COMPLETED)
    }
  }, [queryClient, onUpdatePercent, onSetId])

  return children
}
