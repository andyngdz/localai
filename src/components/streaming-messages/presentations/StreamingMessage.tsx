"use client";

import { useStreamingMessage } from "../states/useStreamingMessage";

export const StreamingMessage = () => {
  const { message } = useStreamingMessage();

  return (
    <div className="fixed w-full h-full top-0 left-0 right-0 bottom-0 backdrop-blur-md bg-black/80 z-10">
      {message}
    </div>
  );
};
