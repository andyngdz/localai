'use client'

import { useCallback, useEffect, useState } from 'react'

export const useUpdaterSettings = () => {
  const [version, setVersion] = useState('Development Build')
  const [isChecking, setIsChecking] = useState(false)

  const onGetVersion = useCallback(async () => {
    const api = globalThis.window.electronAPI
    if (!api) return

    const version = await api.app.getVersion()
    setVersion(version)
  }, [])

  const onCheck = useCallback(async () => {
    setIsChecking(true)

    try {
      await globalThis.window.electronAPI.updater.checkForUpdates()
    } catch (error) {
      // Surface the error via console but reset the loading state so the button re-enables.
      console.error('Failed to check for updates', error)
    } finally {
      setIsChecking(false)
    }
  }, [])

  useEffect(() => {
    onGetVersion()
  }, [onGetVersion])

  return {
    isChecking,
    onCheck,
    version
  }
}
