import { create } from 'zustand'

export interface UseModelSearchSelectorStore {
  model_id: string
}

export const useModelSearchSelectorStore = create<UseModelSearchSelectorStore>(() => ({
  model_id: ''
}))

export const onUpdateModelId = (model_id: string) => {
  useModelSearchSelectorStore.setState({
    model_id
  })
}
export const onResetModelId = () => {
  useModelSearchSelectorStore.setState({ model_id: '' })
}
