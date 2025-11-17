import { ModelLoadProgressResponse } from '@/cores/sockets'
import { create } from 'zustand'

interface State {
  id?: string
  progress?: ModelLoadProgressResponse
}

interface Actions {
  onUpdateProgress: (progress: ModelLoadProgressResponse) => void
  onSetId: (id: string) => void
  reset: VoidFunction
}

export const useModelLoadProgressStore = create<State & Actions>()(
  (set, _get, store) => ({
    id: undefined,
    progress: undefined,

    onUpdateProgress: (progress) => set({ progress }),
    onSetId: (id) => set({ id }),
    reset: () => set(store.getInitialState())
  })
)
