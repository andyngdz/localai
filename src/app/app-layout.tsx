'use client'

import { SettingsButton } from '@/features/settings'
import { FC, PropsWithChildren } from 'react'

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">{children}</main>
      <footer className="sticky bottom-0 z-10 backdrop-blur-md border-t-1 border-default">
        <div className="px-4 flex justify-between items-center">
          <div className="text-sm text-default-500">© {new Date().getFullYear()} LocalAI</div>
          <SettingsButton />
        </div>
      </footer>
    </div>
  )
}
