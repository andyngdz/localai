import { create } from "zustand";

export interface MessageStoreProps {
  message: string;
  setMessage: (message: string) => void;
  reset: VoidFunction;
}

export const useMessageStore = create<MessageStoreProps>(
  (set, _get, store) => ({
    message: "",
    setMessage: (message) => set({ message }),
    reset: () => set(store.getInitialState()),
  })
);
