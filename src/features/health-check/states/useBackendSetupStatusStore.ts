import type { BackendStatusPayload } from '@types'
import { create } from 'zustand'

export const MAX_BACKEND_STATUS_MESSAGES = 100

export interface BackendSetupStatusEntry extends BackendStatusPayload {
  timestamp: number
}

interface BackendSetupStatusStore {
  entries: BackendSetupStatusEntry[]
  addEntry: (payload: BackendStatusPayload) => void
  clear: () => void
}

export const useBackendSetupStatusStore = create<BackendSetupStatusStore>(
  (set) => ({
    entries: [],
    addEntry: (payload) => {
      set((state) => {
        const nextEntries = [
          ...state.entries,
          {
            ...payload,
            timestamp: Date.now()
          }
        ]

        if (nextEntries.length > MAX_BACKEND_STATUS_MESSAGES) {
          nextEntries.splice(
            0,
            nextEntries.length - MAX_BACKEND_STATUS_MESSAGES
          )
        }

        return { entries: nextEntries }
      })
    },
    clear: () => set({ entries: [] })
  })
)
