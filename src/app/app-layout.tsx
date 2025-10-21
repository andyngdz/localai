'use client'

import { AppFooter } from '@/features/app-footer'
import { initializeBackend } from '@/cores/backend-initialization'
import { FC, PropsWithChildren, useEffect } from 'react'

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    initializeBackend()
  }, [])

  return (
    <div className="flex flex-col h-screen">
      <main className="flex justify-center flex-1">{children}</main>
      <AppFooter />
    </div>
  )
}
