'use client'

import { useEffect } from 'react'
import { useBackendSetupStatusStore } from './useBackendSetupStatusStore'

export const useBackendSetupStatus = () => {
  const entries = useBackendSetupStatusStore((state) => state.entries)
  const addEntry = useBackendSetupStatusStore((state) => state.addEntry)
  const clear = useBackendSetupStatusStore((state) => state.clear)

  useEffect(() => {
    const api = globalThis.window.electronAPI

    if (!api.onBackendSetupStatus) {
      return
    }

    const unsubscribe = api.onBackendSetupStatus((payload) => {
      addEntry(payload)
    })

    return () => {
      unsubscribe()
      clear()
    }
  }, [addEntry, clear])

  return {
    entries
  }
}
