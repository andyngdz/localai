'use client'

import { LogEntry } from '@types'
import { useEffect, useState, useCallback } from 'react'

export const MAX_LOGS = 250

export const useBackendLog = () => {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isStreaming, setIsStreaming] = useState(false)

  const startStreaming = useCallback(async () => {
    await window.electronAPI.backend.startLogStream()
    setIsStreaming(true)
  }, [])

  const stopStreaming = useCallback(async () => {
    await window.electronAPI.backend.stopLogStream()
    setIsStreaming(false)
  }, [])

  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  useEffect(() => {
    // Check initial status
    window.electronAPI.backend.isLogStreaming().then(setIsStreaming)

    // Listen to logs
    const unsubscribe = window.electronAPI.backend.onLog((log) => {
      setLogs((prev) => {
        const newLogs = [...prev, log]
        // Keep only the last logs to prevent memory issues
        return newLogs.length > MAX_LOGS ? newLogs.slice(-MAX_LOGS) : newLogs
      })
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    startStreaming()
  }, [startStreaming])

  return { logs, isStreaming, startStreaming, stopStreaming, clearLogs }
}
