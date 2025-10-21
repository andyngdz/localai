import { GeneratorConfigFormValues } from '@/features/generator-configs'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export interface FormValuesStore {
  values?: GeneratorConfigFormValues
  onSetValues: (values: GeneratorConfigFormValues) => void
  reset: () => void
}

export const useFormValuesStore = create<FormValuesStore>()(
  immer((set, _get, store) => ({
    onSetValues: (values: GeneratorConfigFormValues) => {
      set((draft) => {
        draft.values = values
      })
    },
    reset: () => set(store.getInitialState())
  }))
)
