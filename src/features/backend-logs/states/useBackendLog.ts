'use client'

import { useVirtualizer } from '@tanstack/react-virtual'
import { useLayoutEffect, useRef } from 'react'
import { useBackendLogStore } from './useBackendLogStore'

export const useBackendLog = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { logs, isStreaming, clearLogs } = useBackendLogStore()

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: logs.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 50,
    overscan: 10,
    measureElement: (element) => element.getBoundingClientRect().height
  })

  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [logs, scrollRef])

  return {
    logs,
    isStreaming,
    clearLogs,
    scrollRef,
    rowVirtualizer
  }
}
