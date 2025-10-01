'use client'

import { useVirtualizer } from '@tanstack/react-virtual'
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
    await globalThis.window.electronAPI.backend.startLogStream()
    setIsStreaming(true)
  }, [setIsStreaming])

  const stopStreaming = useCallback(async () => {
    await globalThis.window.electronAPI.backend.stopLogStream()
    setIsStreaming(false)
  }, [setIsStreaming])

  const rowVirtualizer = useVirtualizer({
    count: logs.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 50,
    overscan: 10,
    measureElement: (element) => element.getBoundingClientRect().height
  })

  useEffect(() => {
    globalThis.window.electronAPI.backend.isLogStreaming().then(setIsStreaming)

    const unsubscribe = globalThis.window.electronAPI.backend.onLog((log) => {
      addLog(log)
    })

    return unsubscribe
  }, [addLog, setIsStreaming])

  useEffect(() => {
    startStreaming()
  }, [startStreaming])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  return {
    logs,
    isStreaming,
    startStreaming,
    stopStreaming,
    clearLogs,
    onGetLogColor,
    scrollRef,
    rowVirtualizer
  }
}
