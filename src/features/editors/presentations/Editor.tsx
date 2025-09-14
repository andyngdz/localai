'use client'

import { Generator } from '@/features/generators/presentations/Generator'
import { EditorNavbar } from './EditorNavbar'

export const Editor = () => {
  return (
    <div className="flex flex-col h-full w-full">
      <EditorNavbar />
      <Generator />
    </div>
  )
}
