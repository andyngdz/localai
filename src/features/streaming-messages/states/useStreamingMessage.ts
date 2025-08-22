import { socket, SocketEvents } from '@/sockets';
import { useEffect } from 'react';
import { useMessageStore } from './useMessageStores';

export const useStreamingMessage = () => {
  const { message, setMessage, reset } = useMessageStore();

  useEffect(() => {
    socket.on(SocketEvents.DOWNLOAD_START, () => {
      setMessage('Downloading model');
    });

    socket.on(SocketEvents.MODEL_LOAD_COMPLETED, () => reset());

    socket.on(SocketEvents.DOWNLOAD_STEP_PROGRESS, (data) => {
      console.info(data);
    });

    return () => {
      socket.off(SocketEvents.DOWNLOAD_START);
      socket.off(SocketEvents.MODEL_LOAD_COMPLETED);
      socket.off(SocketEvents.IMAGE_GENERATION_STEP_END);
    };
  }, [reset, setMessage]);

  return { message };
};
