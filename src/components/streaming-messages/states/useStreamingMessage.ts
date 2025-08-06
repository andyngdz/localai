import { socket, SocketEvents } from "@/sockets";
import { useEffect, useState } from "react";

export const useStreamingMessage = () => {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    socket.on(SocketEvents.DOWNLOAD_START, () => {
      setMessage("Downloading model");
    });

    socket.on(SocketEvents.MODEL_LOAD_COMPLETED, () => {
      setMessage("");
    });
  }, []);

  return { message };
};
