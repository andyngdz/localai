'use client'

import { AppFooter } from '@/features/app-footer'
import { FC, PropsWithChildren } from 'react'

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex justify-center flex-1">{children}</main>
      <AppFooter />
    </div>
  )
}
