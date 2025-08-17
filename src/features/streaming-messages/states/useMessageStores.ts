import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface MessageStoreProps {
  message: string;
  setMessage: (message: string) => void;
  reset: VoidFunction;
}

export const useMessageStore = create<MessageStoreProps>()(
  immer((set, _, store) => ({
    message: '',
    setMessage: (message) => {
      set((state) => {
        state.message = message;
      });
    },
    reset: () => {
      set(store.getInitialState());
    },
  })),
);
