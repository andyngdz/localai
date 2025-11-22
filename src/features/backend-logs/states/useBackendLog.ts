'use client'

import { useVirtualizer } from '@tanstack/react-virtual'
import { useEffect, useRef } from 'react'
import { useBackendLogStore } from './useBackendLogStore'

export const useBackendLog = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { logs, isStreaming, addLog, clearLogs, setIsStreaming } =
    useBackendLogStore()

  // eslint-disable-next-line react-hooks/incompatible-library
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
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  return {
    logs,
    isStreaming,
    clearLogs,
    scrollRef,
    rowVirtualizer
  }
}
