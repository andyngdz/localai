'use client'

import { Generator } from '@/features/generators'
import { ModelLoadProgressBar } from '@/features/model-load-progress'
import { EditorNavbar } from './EditorNavbar'

export const Editor = () => {
  return (
    <div className="flex flex-col h-full w-full">
      <EditorNavbar />
      <ModelLoadProgressBar />
      <Generator />
    </div>
  )
}
