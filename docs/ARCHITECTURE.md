Next.js 15 + Electron desktop app + Python FastAPI backend.

**Key Patterns:**

- **Feature-first**: `src/features/feature-name/{presentations,states}`
- **State**: Zustand stores with `reset()` pattern
- **Types**: Use `@types` for shared types, `@/*` for src
- **Electron IPC**: Frontend calls `window.electronAPI.backend.method()`
- **Sockets**: Real-time via Socket.io - always use `useSocketEvent()` hook (never `socket.on()` directly)
- **Client Components**: Add `'use client'` when using React hooks, Zustand stores, or browser APIs
- **Data fetching**: React Query for server state, Zustand for client state

**Directory Structure:**

```
src/features/       # Feature modules
src/cores/sockets/  # Socket.io infrastructure (reactive pattern with Zustand)
src/cores/          # Shared utilities, hooks, components
electron/           # Main process + preload
scripts/            # Build scripts (Python backend, Electron compile)
types/              # Shared TypeScript types
```
