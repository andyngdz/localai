'use client'

import {
  initializeBackend,
  useBackendInitStore
} from '@/cores/backend-initialization'
import { FullScreenLoader } from '@/cores/presentations'
import { AppFooter } from '@/features/app-footer'
import { WindowTitleBar } from '@/features/window-controls/presentations/WindowTitleBar'
import { usePathname } from 'next/navigation'
import { FC, PropsWithChildren, useEffect, useMemo } from 'react'

const getSectionName = (pathname: string): string => {
  if (pathname === '/') return 'Home'
  if (pathname.startsWith('/generator')) return 'Generator'
  if (pathname.startsWith('/histories')) return 'Histories'
  if (pathname.startsWith('/models')) return 'Models'
  if (pathname.startsWith('/settings')) return 'Settings'
  return ''
}

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname()
  const isInitialized = useBackendInitStore((state) => state.isInitialized)
  const isHomePage = pathname === '/'

  const currentSection = useMemo(() => getSectionName(pathname), [pathname])

  useEffect(() => {
    initializeBackend()
  }, [])

  // Home page (HealthCheck) should always render to show initialization logs
  // Other pages should wait for backend initialization to complete
  const shouldRenderContent = isHomePage || isInitialized

  return (
    <div className="flex flex-col h-screen rounded-2xl">
      <WindowTitleBar currentSection={currentSection} />
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
