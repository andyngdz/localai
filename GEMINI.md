# Gemini Context: LocalAI

This document provides context for the LocalAI project, a desktop application for local AI image generation.

## Project Overview

LocalAI is a privacy-focused desktop application built with Electron and Next.js. It allows users to generate AI images using Stable Diffusion models from HuggingFace entirely on their own machines. The application is designed to be 100% private and work offline after initial model downloads.

The frontend is built with Next.js, React, and TypeScript, using TailwindCSS for styling. State management is handled by Zustand and TanStack Query. The desktop application is powered by Electron. A Python backend using FastAPI is used for the AI image generation. Real-time communication between the frontend and backend is handled with Socket.io.

The project follows a feature-first architecture, with features organized in the `src/features` directory.

## Building and Running

### Prerequisites

- Node.js (LTS)
- Python 3.11
- npm or yarn
- Git

### Installation and Running

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Run the desktop application in development mode:**
    ```bash
    npm run desktop
    ```
    This command starts the Next.js development server, the Electron app, and the Python backend.

### Other Key Scripts

- **`npm run dev`**: Starts the Next.js development server only.
- **`npm test`**: Runs the test suite using Vitest.
- **`npm run type-check`**: Runs TypeScript type checking.
- **`npm run lint`**: Lints the code using ESLint.
- **`npm run format`**: Formats the code using Prettier.
- **`npm run build`**: Builds the application for production.

## Development Conventions

- **Coding Style:** The project uses ESLint and Prettier for code linting and formatting. Configuration can be found in `eslint.config.mjs` and `.prettierrc`.
- **Testing:** Tests are written with Vitest and React Testing Library. Test files are co-located with the source files in `__tests__` directories.
- **Commits:** The project follows the Conventional Commits specification.
- **Releases:** Releases are automated using `semantic-release`.
