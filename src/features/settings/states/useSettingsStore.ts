import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { SettingFormValues } from '../types'

interface UseSettingsStore {
  values: SettingFormValues
  setValues: (values: SettingFormValues) => void
  reset: () => void
}

const useSettingsStore = create<UseSettingsStore>()(
  devtools(
    persist(
      (set, _get, state) => ({
        values: {
          safetyCheck: true
        },
        setValues: (values) => set({ values }),
        reset: () => set(state.getInitialState())
      }),
      {
        name: 'app-settings'
      }
    )
  )
)

export { useSettingsStore }
