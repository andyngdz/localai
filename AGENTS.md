# Repository Guidelines

## Project Structure & Module Organization

- `src/app`: Next.js App Router entrypoints, layouts, and top-level routes.
- `src/features/*`: Feature slices that co-locate UI, state, types, and tests; prefer keeping presentation and logic in separate subfolders.
- Shared foundations live in `src/cores`, `src/services`, `src/sockets`, `src/types`, and `src/assets`.
- Desktop runtime code is under `electron/` (`main.ts`, `preload.ts`, compiled output ignored).
- Static assets are served from `public/`; build artifacts (`.next/`, `dist/renderer/`) must stay untracked.

## Build, Test, and Development Commands

- `npm run dev`: Start the web UI with Turbopack.
- `npm run desktop`: Launch Next.js and Electron together via `scripts/devall.ts`.
- `npm run build`: Compile Electron scripts, build Next.js, and package the desktop app.
- `npm start`: Serve the production web bundle locally.
- `npm run type-check`: Run `tsc --noEmit` for repository-wide typing guarantees.
- `npm run lint` / `npm run format`: Enforce ESLint rules and Prettier formatting.
- `npm test` / `npm run test:coverage`: Execute Vitest suites and generate coverage reports.

## Coding Style & Naming Conventions

- Language: TypeScript with ES modules and path aliases from `tsconfig.json`.
- Formatting: Prettier (2 spaces, single quotes, no semicolons, 100-char width); run `npm run format` before committing.
- Components use PascalCase (`EditorNavbar.tsx`), functions and variables use camelCase, directories stick to kebab-case.
- Favor named exports for reusable hooks, utils, and shared UI widgets.

## Testing Guidelines

- Framework: Vitest + Testing Library (`vitest.setup.ts` wires DOM helpers).
- Test placement: co-locate in `__tests__/` or `*.test.ts(x)` files beside the source module.
- Keep tests deterministic and mock network or OS interactions; reference `scripts/__tests__/electron.test.ts` for zx/Electron patterns.
- Before pushing, run `npm test` and optionally `npm run test:coverage` (HTML output in `coverage/`).

## Commit & Pull Request Guidelines

- Follow Conventional Commits (`feat:`, `fix:`, `test:`, `chore:`); reference tickets in parentheses when applicable.
- Each PR should include a summary, screenshots for UI updates, test notes, and linked issues.
- Ensure `npx lint-staged` passes locally; CI enforces lint, format, and type-check before merge.
- Avoid committing secrets; rely on environment files ignored by git.

## Security & Configuration Tips

- Renderer code cannot access Node APIs directly—use IPC bridges defined in `electron/preload.ts`.
- Store persistent user data under the Electron userData path; never write into the repo at runtime.
- Keep third-party credentials out of the repository and rotate tokens used in development whenever exposure is suspected.
