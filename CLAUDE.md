# Agent Guide for LocalAI

## Quick Commands

- **Single test**: `pnpm test -- path/to/test.test.ts`
- **All tests**: `pnpm test` | **Coverage**: `pnpm test:coverage`
- **Dev server**: `pnpm run dev` | **Desktop**: `pnpm run desktop`
- **Lint**: `pnpm run lint` | **Format**: `pnpm run format` | **Type check**: `pnpm run type-check`

## Architecture

Next.js 15 + Electron + Python FastAPI. Feature-first structure: `src/features/feature-name/{presentations,states}`. Zustand for state, React Query for server data, Socket.io with reactive Zustand pattern (never `socket.on()` directly, use `useSocketEvent()` hook).

## Code Style

- **TypeScript**: Never use `any` (error enforced). Use `unknown` or proper types. Path aliases: `@/*` for src, `@types` for shared types
- **Format**: Prettier - 2 spaces, single quotes, no semicolons, 80-char width
- **Naming**: PascalCase components (with feature prefix: `GeneratorImageRenderer`), camelCase functions/vars, kebab-case dirs
- **Imports**: Group by external → internal → types. Use `es-toolkit/compat` for utilities
- **Components**: `'use client'` for hooks/Zustand/browser APIs. Hooks at top (custom → UI library → React). Use `useMemo` for conditional/expensive renders
- **State**: Zustand for shared state, `useState` for local. Use `partialize` to exclude UI state from persistence. Prefer `useLocalStorage` over `useRef` for persistent component state
- **Comments**: Brief action-focused (what, not why/how). Use `// Step N: <action>` for workflows. Omit when code is self-documenting
- **Simplicity**: Simple vars over nested access, direct function refs vs arrows, YAGNI principle, extract conditionals to named vars before JSX

## Critical Rules

- **Electron IPC**: Frontend uses `window.electronAPI.backend.method()`
- **Sockets**: Only `useSocketEvent()` hook, never direct `socket.on()`
- **Types**: `@typescript-eslint/no-explicit-any` enforced as error
- **Research**: Check official docs/patterns before implementing unfamiliar APIs

## Skills (Mandatory)

**BEFORE any task**: Check if a skill applies → Use it. No exceptions.

- `testing-requirements` - Test structure/verification
- `security-patterns` - Electron IPC security
- `critical-rules` - TypeScript/sockets/useEffect
- `best-practices` - Validation/refactoring
- `communication-guidelines` - Questions/commits

## Documentation to Read

- @docs/ARCHITECTURE.md - Stack, structure, circular imports, modularity rules
- @docs/CODING_STYLE.md - Complete style guide with examples
- @docs/DEVELOPMENT_COMMANDS.md - All available commands

## Active Technologies

- TypeScript 5.9, React 19, Next.js 16 + TanStack Query 5.x, Zustand 5.x, Axios, HeroUI (009-backend-config)
- N/A (in-memory state only) (009-backend-config)
- N/A (React Query cache + existing Zustand persistence) (009-backend-config)

## Recent Changes

- 009-backend-config: Added TypeScript 5.9, React 19, Next.js 16 + TanStack Query 5.x, Zustand 5.x, Axios, HeroUI
