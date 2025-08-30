import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface UseSettingsStore {
  apiBaseUrl: string
  isSafetyCheckEnabled: boolean
  setApiBaseUrl: (url: string) => void
  toggleSafetyCheck: () => void
  reset: () => void
}

const useSettingsStore = create<UseSettingsStore>()(
  devtools(
    persist(
      (set, get, state) => ({
        apiBaseUrl: 'http://localhost:8000',
        isSafetyCheckEnabled: true,
        setApiBaseUrl: (url) => set({ apiBaseUrl: url }),
        toggleSafetyCheck: () =>
          set((state) => ({
            isSafetyCheckEnabled: !state.isSafetyCheckEnabled
          })),
        reset: () => set(state.getInitialState())
      }),
      {
        name: 'app-settings'
      }
    )
  )
)

export { useSettingsStore }
