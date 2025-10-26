Uses **Zustand-based reactive pattern** for Socket.io connections:

- Socket instance stored in Zustand store (`useSocket.ts`)
- Components subscribe via `useSocketEvent()` hook
- When socket URL changes, all subscribers automatically re-connect
- **Rule:** Never use `socket.on()` directly - always use `useSocketEvent()` for automatic cleanup

**Example:**

```typescript
useSocketEvent(SocketEvents.DOWNLOAD_START, handleDownload, [handleDownload])
```
