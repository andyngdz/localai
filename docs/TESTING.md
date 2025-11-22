# Testing Guide

**Framework:** Vitest + React Testing Library

**Core Principles:**

- Test behavior, not implementation details (what it does, not how)
- Mock external dependencies (APIs, React Query, Electron, sockets)
- Keep tests focused and readable
- **Verification:** Always run `pnpm run type-check && pnpm run lint && pnpm run format && pnpm test -- path/to/test` before completing

**Setup:**

- Location: `__tests__/` folders next to source
- Mocking: Reset Zustand stores in `beforeEach`, mock Electron via `global.window.electronAPI`

**Coverage Goals:**

- Aim for 100% on critical paths (state management, data flow, business logic)
- Command: `pnpm run test:coverage -- path/to/files`
- Focus on behavior coverage, not just line coverage

**Testing Patterns:**

```typescript
// Socket Events - Capture handlers
let handlers: Record<string, (data: unknown) => void> = {}
vi.mock('@/cores/sockets', () => ({ useSocketEvent: (e, h) => handlers[e] = h }))
handlers[SocketEvents.DOWNLOAD_START]({ id: 'model-123' })

// Zustand Stores
const { result } = renderHook(() => useMyStore())
act(() => result.current.setValue('new'))

// React Query
render(<QueryClientWrapper><MyComponent /></QueryClientWrapper>)
```
