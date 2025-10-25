# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Plan Mode

When exiting plan mode to begin implementation, ALWAYS save the implementation plan first as a markdown file in docs/

- Format: {serial-number}-{plan-name}.md

## Communication Guidelines

**Ask clarifying questions before proposing solutions. Never make assumptions about user intent.**

- Use `AskUserQuestion` tool for ambiguous requests ("optimize this", "fix the error", "improve performance")
- Get full context before implementing complex features (authentication, APIs, new architectures)
- **Don't ask** for trivial commands (running tests, formatting, reading files)
- Present options as selectable choices when multiple approaches exist

## Development Commands

- **Dev server**: `npm run dev` (Next.js with Turbopack)
- **Desktop dev**: `npm run desktop` (Next.js + Electron concurrently)
- **Build**: `npm run build`
- **Tests**: `npm test` or `npm test -- path/to/test.tsx`
- **Type check**: `npm run type-check`
- **Lint/Format**: `npm run lint` / `npm run format`

## Architecture

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

### Socket Architecture

Uses **Zustand-based reactive pattern** for Socket.io connections:

- Socket instance stored in Zustand store (`useSocket.ts`)
- Components subscribe via `useSocketEvent()` hook
- When socket URL changes, all subscribers automatically re-connect
- **Rule:** Never use `socket.on()` directly - always use `useSocketEvent()` for automatic cleanup

**Example:**

```typescript
useSocketEvent(SocketEvents.DOWNLOAD_START, handleDownload, [handleDownload])
```

## Coding Style

- **Language**: TypeScript with ES modules, path aliases (`@/*`, `@types`)
- **Format**: Prettier (2 spaces, single quotes, no semicolons, 100-char width)
- **Naming**: PascalCase for components, camelCase for functions/variables, kebab-case for directories
- **Commits**: Conventional format (`feat:`, `fix:`, `test:`, `chore:`)

## Testing

**Framework:** Vitest + React Testing Library

**Core Principles:**

- Test behavior, not implementation details (what it does, not how)
- Mock external dependencies (APIs, React Query, Electron, sockets)
- Keep tests focused and readable
- **Verification:** Always run `npm run type-check && npm run lint && npm run format && npm test -- path/to/test` before completing

**Setup:**

- Location: `__tests__/` folders next to source
- Mocking: Reset Zustand stores in `beforeEach`, mock Electron via `global.window.electronAPI`

**Coverage Goals:**

- Aim for 100% on critical paths (state management, data flow, business logic)
- Command: `npm run test:coverage -- path/to/files`
- Focus on behavior coverage, not just line coverage

**Testing Patterns (Simplified):**

```typescript
// Socket Events - Capture handlers
let handlers: Record<string, Function> = {}
vi.mock('@/cores/sockets', () => ({
  useSocketEvent: (event, handler) => (handlers[event] = handler)
}))
handlers[SocketEvents.DOWNLOAD_START]({ id: 'model-123' })

// Zustand Stores
const { result } = renderHook(() => useMyStore())
act(() => result.current.setValue('new'))

// React Query
const Wrapper = createQueryClientWrapper()
render(<Wrapper><MyComponent /></Wrapper>)
```

## Security

- Renderer cannot access Node APIs directly - use IPC bridges in `electron/preload.ts`
- Use `window.electronAPI` for all Electron interactions

## Common Patterns & Mistakes

### Critical Rules

**1. TypeScript Type Safety:**

- ❌ **NEVER use `any` type** - no exceptions, including tests
- ✅ Use proper types, `unknown`, or type assertions (`as Type`)
- ✅ For complex scenarios: use `unknown` then narrow with type guards
- ✅ For test mocks: use `as unknown as Type` for proper typing

**2. Socket Event Handling:**

- ❌ `socket.on('event', callback)` - Breaks on socket reconnection
- ✅ `useSocketEvent('event', callback, [callback])` - Reactive and safe

**3. useEffect Cleanup:**

- Must be synchronous - don't use `async () => { await ... }`
- Fire-and-forget for async: `api.cleanup().catch(console.error)`

**4. Test Implementation vs Behavior:**

- ❌ Testing that `socket.on` was called 3 times
- ✅ Testing that component responds correctly to events

### Best Practices

**Validate before claiming success:**

- Unit tests passing ≠ code is performant or correct
- Check application logs for warnings and timing
- Test with real workloads when possible

**Question patterns before copying:**

- What problem does this solve?
- Does this apply to my use case?
- What's the performance impact?

**When refactoring:**

- Update tests when behavior/API contracts change
- Simplify tests when implementation simplifies
- Prefer editing existing files over creating new ones

**Extract duplicated configuration:**

- Identical configs/options in multiple files → Extract to constants
- Example: Socket.io options duplicated → `SOCKET_CONFIG` constant in `src/cores/sockets/constants/`

## Updating This File

Add to this file when you discover:

- New architectural patterns used across features
- Common mistakes that caused bugs
- Critical rules that prevented problems

Don't add:

- Every coding preference or style choice
- Obvious best practices covered by linters
- Temporary workarounds or hacks
