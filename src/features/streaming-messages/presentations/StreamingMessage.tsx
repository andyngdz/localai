"use client";

import AIAnimationData from "@/assets/ai.json";
import clsx from "clsx";
import Lottie from "react-lottie";
import { useStreamingMessage } from "../states/useStreamingMessage";

export const StreamingMessage = () => {
  const { message } = useStreamingMessage();
  console.info("StreamingMessage", message);

  if (message.length > 0) {
    return (
      <div
        className={clsx("fixed inset-0 z-10", "backdrop-blur-md bg-black/90")}
      >
        <div
          className={clsx(
            "flex flex-col gap-2 items-center justify-center",
            "h-full w-full"
          )}
        >
          <Lottie
            options={{ animationData: AIAnimationData }}
            width={48}
            height={48}
          />
          <span className="text-sm font-medium">{message}</span>
        </div>
      </div>
    );
  }
};
