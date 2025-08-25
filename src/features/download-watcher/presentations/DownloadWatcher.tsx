'use client'

import { FC, PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { useDownloadWatcherStore } from '../states'
import { useQueryClient } from '@tanstack/react-query'
import {
  DownloadModelStartResponse,
  DownloadStepProgressResponse,
  socket,
  SocketEvents
} from '@/sockets'

export const DownloadWatcher: FC<PropsWithChildren> = ({ children }) => {
  const queryClient = useQueryClient()
  const { onUpdatePercent, onSetId } = useDownloadWatcherStore()

  useEffect(() => {
    socket.on(SocketEvents.DOWNLOAD_START, (data: DownloadModelStartResponse) => {
      onSetId(data.id)
    })

    socket.on(SocketEvents.DOWNLOAD_STEP_PROGRESS, (data: DownloadStepProgressResponse) => {
      const { id, step, total } = data

      onUpdatePercent(step / total)
      onSetId(id)
    })

    socket.on(SocketEvents.DOWNLOAD_COMPLETED, () => {
      onUpdatePercent(0.0)
      onSetId('')
      queryClient.invalidateQueries({
        queryKey: ['downloaded-models']
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
