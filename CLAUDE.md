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
- **Client Components**: Add `'use client'` when using React hooks, Zustand stores, or browser APIs
- **Data fetching**: React Query for server state management, Zustand for client state

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
- **Keep tests simple and focused** - test behavior, not implementation details
- Test user-facing functionality; avoid testing internal state
- Mock external dependencies (API calls, React Query, Electron APIs)
- Aim for 50-150 lines per test file; split if exceeding 200 lines
- **Always verify**: Run `npm run type-check && npm run lint && npm run format && npm test -- path/to/test` before completing

### When to Update Tests

- When refactoring changes component behavior, return values, or side effects
- When component API contracts change (props, hooks)
- Tests should reflect current implementation, not outdated behavior
- If implementation simplifies (e.g., hook no longer returns data), simplify tests too

## Security

- Renderer cannot access Node APIs directly—use IPC bridges in `electron/preload.ts`
- Use `window.electronAPI` for all Electron interactions

## Important Reminders

- Do what's asked, nothing more
- Prefer editing over creating new files
- Keep tests simple and concise (not 500 lines!)
- Never proactively create documentation files

## Common Mistakes to Avoid

**1. Question every code pattern before copying it**

- Don't cargo cult program (copy patterns without understanding why they exist)
- Before adding code, ask:
  - "What problem does this solve?"
  - "Does this apply to my use case?"
  - "What's the performance impact?"
- Test with real workloads, not just unit tests

**2. Test with real-world loads before claiming success**

- Unit tests passing ≠ code is performant or correct
- Check application logs for warnings and timing issues
- Verify the solution doesn't introduce worse problems than it solves

## Communication Guidelines

**ALWAYS ask clarifying questions before proposing solutions. NEVER make assumptions about user intent.**

- Use the `AskUserQuestion` tool to present questions as selectable options/checkboxes
- Maximum 4 options per question (tool limitation)
- Each option needs: `label` (short title), `description` (explanation)
- Get full context before jumping into implementation

**When to ask questions:**

- Implementation tasks (new features, refactoring, bug fixes)
- Ambiguous requests: "optimize this", "fix the error", "improve performance"
- Complex requests: "add authentication", "integrate with API"
- Continuation scenarios: "continue", "keep going" → Ask which specific task
- Any request where multiple valid approaches exist

**When NOT to ask (trivial commands):**

- Simple test runs: "run tests", "pytest"
- Code formatting: "format code", "ruff format"
- Informational: "show me the logs", "what does this function do"
- Explicit with clear intent: "run tests on file X", "read function Y at line Z"

**Examples:**

- User: "optimize this" → Ask: speed, memory, readability, or code size?
- User: "fix the bug" → Ask: which bug, where, what's expected behavior?
- User: "continue" → Ask: continue which task (list recent incomplete tasks)?
- User: "add auth" → Ask: method (JWT/OAuth), token storage, session duration?
