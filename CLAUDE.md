# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
- **Sockets**: Real-time via Socket.io (`src/sockets/socket.ts`)

**Directory Structure:**

```
src/features/  # Feature modules
electron/      # Main process + preload
scripts/       # Build scripts (Python backend, Electron compile)
types/         # Shared TypeScript types
```

## Coding Style

- **Language**: TypeScript with ES modules, path aliases (`@/*`, `@types`)
- **Format**: Prettier (2 spaces, single quotes, no semicolons, 100-char width)
- **Naming**: PascalCase for components, camelCase for functions/variables, kebab-case for directories
- **Commits**: Conventional format (`feat:`, `fix:`, `test:`, `chore:`)

## Testing

- **Framework**: Vitest + React Testing Library
- **Location**: `__tests__/` folders next to source
- **Mocking**: Reset Zustand stores in `beforeEach`, mock Electron API via `global.window.electronAPI`
- **Keep tests simple and focused** - avoid over-testing edge cases
- **Always verify**: Run `npm run type-check && npm run lint && npm run format && npm test -- path/to/test` before completing

## Security

- Renderer cannot access Node APIs directly—use IPC bridges in `electron/preload.ts`
- Use `window.electronAPI` for all Electron interactions

## Important Reminders

- Do what's asked, nothing more
- Prefer editing over creating new files
- Keep tests simple and concise (not 500 lines!)
- Never proactively create documentation files
