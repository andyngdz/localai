'use client'

import { LogEntry } from '@types'
import { useEffect, useState, useCallback } from 'react'

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
      setLogs((prev) => [...prev, log])
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    startStreaming()
  }, [startStreaming])

  return { logs, isStreaming, startStreaming, stopStreaming, clearLogs }
}
