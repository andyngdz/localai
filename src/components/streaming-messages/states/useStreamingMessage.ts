import { socket, SocketEvents } from "@/sockets";
import { useEffect, useState } from "react";

export const useStreamingMessage = () => {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    socket.on(SocketEvents.DOWNLOAD_START, (data) => {
      setMessage(data.message);
    });
  }, []);

  return { message };
};
