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
        const lastEntry = state.entries.at(-1)
        const isDuplicate =
          lastEntry?.level === payload.level &&
          lastEntry?.message === payload.message &&
          JSON.stringify(lastEntry?.commands ?? []) ===
            JSON.stringify(payload.commands ?? [])

        if (isDuplicate) {
          return state
        }

        const nextEntries = [
          ...state.entries,
          {
            ...payload,
            timestamp: Date.now()
          }
        ]

        if (nextEntries.length > MAX_BACKEND_STATUS_MESSAGES) {
          return {
            entries: nextEntries.slice(-MAX_BACKEND_STATUS_MESSAGES)
          }
        }

        return { entries: nextEntries }
      })
    },
    clear: () => set({ entries: [] })
  })
)
