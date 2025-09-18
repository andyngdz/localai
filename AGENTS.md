- Always say 'AGENTS.md is working' at the start
- Do not make any changes, until you have 95% confidence that you know what to build ask me follow up questions until you have that confidence

# Repository Guidelines

## Project Structure & Module Organization

- `src/app`: Next.js routes/layouts (App Router).
- `src/features/*`: Feature modules (presentations, states, constants, types, tests).
- `src/cores`, `src/services`, `src/sockets`, `src/types`, `src/assets`: Shared UI, APIs, sockets, types, and media.
- `src-tauri/`: Tauri v2 backend (Rust commands, configuration, icons).
- `public/`: Static assets served by Next.js.
- Build output: `.next/` (dev), `dist/renderer/` (Next export used by Tauri bundler). Do not commit build artifacts.

## Build, Test, and Development Commands

- `npm run dev`: Start Next.js dev server (Turbopack).
- `npm run tauri dev`: Launch Tauri dev workflow (spawns Next.js then desktop shell).
- `npm run build`: Build the web app (`next build`).
- `npm start`: Start the built web app locally.
- `npm run lint` / `npm run format`: ESLint and Prettier.
- `npm test` / `npm run test:coverage`: Run Vitest and generate coverage.

## Coding Style & Naming Conventions

- TypeScript + ESM. Import paths use tsconfig paths.
- Prettier: 2 spaces, single quotes, no semicolons, width 100.
- ESLint: `next/core-web-vitals` + TypeScript rules.
- Names: PascalCase for React components (e.g., `EditorNavbar.tsx`), camelCase for vars/functions, kebab-case for folders.
- Prefer named exports for shared utilities and hooks.

## Testing Guidelines

- Frameworks: Vitest + Testing Library (`jsdom`), setup in `vitest.setup.ts`.
- Location: co-locate in `__tests__` or `*.test.ts(x)` next to source.
- Run `npm test` before pushing; check coverage report via `npm run test:coverage` (HTML report in `coverage/`).
- Keep tests deterministic; avoid real network calls; snapshot files in `__snapshots__/` are allowed.
- Run `npx lint-staged` after testing to make sure no typescript errors, lint and format are up to date.

### Example how to mock NextImage (next/image)

```typescript
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt="Test image" />
  }
}))
```

## Commit & Pull Request Guidelines

- Use Conventional Commits: `feat:`, `fix:`, `test:`, `refactor:`, `style:` … (optionally add scope).
- Keep commits focused and descriptive; reference issues (e.g., `fix: handle GPU fallback (closes #42)`).
- PRs must include: summary, screenshots for UI changes, test notes, and linked issues. CI must pass (Husky/lint-staged enforce type-check, lint, and format).

## Security & Configuration Tips

- Browser context runs inside the Tauri WebView; avoid direct filesystem or OS access from frontend. Expose functionality via Rust commands/plugins.
- Never commit secrets; store local assets in `public/` or `src/assets/` as appropriate.
