import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { SettingFormValues } from '../types'

export type SettingsTab = 'general' | 'models' | 'updates'

interface UseSettingsStore {
  values: SettingFormValues
  setValues: (values: SettingFormValues) => void
  reset: () => void
  isModalOpen: boolean
  selectedTab: SettingsTab
  openModal: (tab?: SettingsTab) => void
  closeModal: VoidFunction
  setSelectedTab: (tab: SettingsTab) => void
}

const useSettingsStore = create<UseSettingsStore>()(
  devtools(
    persist(
      (set, _get, state) => ({
        values: {
          safetyCheck: true
        },
        setValues: (values) => set({ values }),
        reset: () => set(state.getInitialState()),
        isModalOpen: false,
        selectedTab: 'general',
        openModal: (tab = 'general') =>
          set({ isModalOpen: true, selectedTab: tab }),
        closeModal: () => set({ isModalOpen: false }),
        setSelectedTab: (tab) => set({ selectedTab: tab })
      }),
      {
        name: 'app-settings',
        partialize: (state) => ({ values: state.values })
      }
    )
  )
)

export { useSettingsStore }
