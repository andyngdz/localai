import { create } from 'zustand'

export interface UseModelSelectStore {
  model_id: string
}

export const useModelSelectorStore = create<UseModelSelectStore>(() => ({
  model_id: ''
}))

export const onUpdateModelId = (model_id: string) => {
  useModelSelectorStore.setState({
    model_id
  })
}
export const onResetModelId = () => {
  useModelSelectorStore.setState({ model_id: '' })
}
