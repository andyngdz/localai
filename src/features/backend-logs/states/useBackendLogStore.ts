import type { LogEntry } from '@types'
import { create } from 'zustand'

export const MAX_LOGS = 250

interface BackendLogStore {
  logs: LogEntry[]
  isStreaming: boolean
  addLog: (log: LogEntry) => void
  clearLogs: () => void
  setIsStreaming: (isStreaming: boolean) => void
}

const getInitialState = () => ({
  logs: [],
  isStreaming: false
})

export const useBackendLogStore = create<BackendLogStore>((set) => ({
  ...getInitialState(),

  addLog: (log: LogEntry) => {
    set((state) => {
      const newLogs = [...state.logs, log]

      return {
        logs: newLogs.length > MAX_LOGS ? newLogs.slice(-MAX_LOGS) : newLogs
      }
    })
  },

  clearLogs: () => {
    set({ logs: [] })
  },

  setIsStreaming: (isStreaming: boolean) => {
    set({ isStreaming })
  }
}))
