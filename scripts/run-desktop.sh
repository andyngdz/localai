#!/usr/bin/env bash
set -euo pipefail

# Run Next.js dev server and Electron together
concurrently -n "NEXT,ELECTRON" -c "yellow,blue" --kill-others "npm run dev" "electron ."
