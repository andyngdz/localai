'use client'

import { AppFooter } from '@/features/app-footer'
import {
  initializeBackend,
  useBackendInitStore
} from '@/cores/backend-initialization'
import { FullScreenLoader } from '@/cores/presentations'
import { usePathname } from 'next/navigation'
import { FC, PropsWithChildren, useEffect } from 'react'

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname()
  const isInitialized = useBackendInitStore((state) => state.isInitialized)
  const isHomePage = pathname === '/'

  useEffect(() => {
    initializeBackend()
  }, [])

  // Home page (HealthCheck) should always render to show initialization logs
  // Other pages should wait for backend initialization to complete
  const shouldRenderContent = isHomePage || isInitialized

  return (
    <div className="flex flex-col h-screen">
      <main className="flex justify-center flex-1">
        {shouldRenderContent ? (
          children
        ) : (
          <FullScreenLoader message="Initializing backend..." />
        )}
      </main>
      <AppFooter />
    </div>
  )
}
