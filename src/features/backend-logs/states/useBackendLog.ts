'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useBackendLogStore } from './useBackendLogStore'

export const useBackendLog = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { logs, isStreaming, addLog, clearLogs, setIsStreaming } =
    useBackendLogStore()

  const onGetLogColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-danger'
      case 'warn':
        return 'text-warning'
      case 'info':
        return 'text-secondary'
      case 'log':
      default:
        return 'text-default-700'
    }
  }

  const startStreaming = useCallback(async () => {
    await window.electronAPI.backend.startLogStream()
    setIsStreaming(true)
  }, [setIsStreaming])

  const stopStreaming = useCallback(async () => {
    await window.electronAPI.backend.stopLogStream()
    setIsStreaming(false)
  }, [setIsStreaming])

  useEffect(() => {
    window.electronAPI.backend.isLogStreaming().then(setIsStreaming)

    const unsubscribe = window.electronAPI.backend.onLog((log) => {
      addLog(log)
    })

    return unsubscribe
  }, [addLog, setIsStreaming])

  useEffect(() => {
    startStreaming()
  }, [startStreaming])

  return {
    logs,
    isStreaming,
    startStreaming,
    stopStreaming,
    clearLogs,
    onGetLogColor,
    scrollRef
  }
}
