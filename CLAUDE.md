# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Common Tasks

- **Start development server**: `npm run dev` (Next.js with Turbopack)
- **Start desktop development**: `npm run desktop` (runs Next.js + Electron concurrently)
- **Build for production**: `npm run build` (compiles Electron + builds Next.js + packages with electron-builder)
- **Compile Electron only**: `npm run compile`

### Testing & Quality

- **Run all tests**: `npm test` (Vitest)
- **Run single test**: `npm test -- path/to/test.tsx`
- **Run tests with coverage**: `npm run test:coverage`
- **Type checking**: `npm run type-check`
- **Lint code**: `npm run lint` (ESLint)
- **Format code**: `npm run format` (Prettier)
- **CI lint**: `npm run ci:lint` (with JSON output)
- **CI format check**: `npm run ci:format`

## Architecture Overview

This is a Next.js/React frontend with Electron integration and a separate Python FastAPI backend. The project uses a feature-first architecture.

### Core Structure

- **Frontend**: Next.js 15 with App Router in TypeScript
- **Desktop**: Electron wrapper for native desktop app
- **Backend**: Separate Python FastAPI service (localai_backend/)
- **State Management**: Zustand stores
- **Styling**: Tailwind CSS 4 + HeroUI components
- **Testing**: Vitest + React Testing Library
- **Real-time**: Socket.io for WebSocket communication

### Key Directories

```
src/
├── app/              # Next.js app router pages
├── cores/            # Core utilities and constants
├── features/         # Feature modules (feature-first architecture)
│   └── feature-name/
│       ├── presentations/  # UI components + tests
│       └── states/         # Zustand stores + hooks + tests
├── services/         # API integration (axios + React Query)
└── sockets/          # Socket.io configuration
```

### Development Patterns

- **Features**: Self-contained modules in `src/features/` with presentations (UI) and states (logic)
- **Components**: Use HeroUI + Tailwind, keep small and focused
- **State**: Zustand stores following the reset pattern with `getInitialState()`
- **API**: Centralized in `src/services/api.ts` with React Query hooks
- **Socket Events**: Real-time communication using shared socket instance and constants

### Scripts Architecture

The `scripts/` directory contains TypeScript utilities for development and build processes:

- **Backend management**: Python environment setup, LocalAI backend cloning/starting
- **Electron compilation**: TypeScript to CommonJS compilation for Electron main/preload
- **Development orchestration**: Concurrent Next.js and Electron processes

## Testing Guidelines

- **Framework**: Vitest + React Testing Library
- **Location**: Tests in `__tests__/` folders mirroring source structure
- **Patterns**: AAA pattern (Arrange-Act-Assert), descriptive test names
- **Mocking**: Use `vi.mock()` and clean up with `afterEach`
- **Coverage**: Target ≥80% for functions, lines, and branches

## Pre-Commit Checklist

Before committing changes:

1. Run affected tests: `npm test -- path/to/changed/files`
2. Run linter: `npm run lint`
3. Run type checker: `npm run type-check`
4. Format code: `npm run format`
