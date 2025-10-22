'use client'

import { FullScreenLoader } from '@/cores/presentations'
import { useStreamingMessage } from '../states/useStreamingMessage'

export const StreamingMessage = () => {
  const { message } = useStreamingMessage()

  if (message.length > 0) {
    return <FullScreenLoader message={message} />
  }
}
