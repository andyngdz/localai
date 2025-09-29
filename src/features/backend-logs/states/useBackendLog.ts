'use client'

import { useCallback, useEffect } from 'react'
import { useBackendLogStore } from './useBackendLogStore'

export const useBackendLog = () => {
  const { logs, isStreaming, addLog, clearLogs, setIsStreaming } =
    useBackendLogStore()

  const startStreaming = useCallback(async () => {
    await window.electronAPI.backend.startLogStream()
    setIsStreaming(true)
  }, [setIsStreaming])

  const stopStreaming = useCallback(async () => {
    await window.electronAPI.backend.stopLogStream()
    setIsStreaming(false)
  }, [setIsStreaming])

  useEffect(() => {
    // Check initial status
    window.electronAPI.backend.isLogStreaming().then(setIsStreaming)

    // Listen to logs
    const unsubscribe = window.electronAPI.backend.onLog((log) => {
      addLog(log)
    })

    return unsubscribe
  }, [addLog, setIsStreaming])

  useEffect(() => {
    startStreaming()
  }, [startStreaming])

  return { logs, isStreaming, startStreaming, stopStreaming, clearLogs }
}
