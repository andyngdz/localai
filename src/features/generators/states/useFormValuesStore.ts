import { FORM_DEFAULT_VALUES } from '@/features/generators/constants'
import { GeneratorConfigFormValues } from '@/features/generator-configs'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface FormValuesStore {
  values: GeneratorConfigFormValues
  setValues: (values: GeneratorConfigFormValues) => void
  reset: () => void
}

export const useFormValuesStore = create<FormValuesStore>()(
  persist(
    immer((set, get, store) => ({
      values: FORM_DEFAULT_VALUES,
      setValues: (values: GeneratorConfigFormValues) => {
        set((state) => {
          state.values = values
        })
      },
      reset: () => set(store.getInitialState())
    })),
    {
      name: 'generator-form-values',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
