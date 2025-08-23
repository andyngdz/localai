#!/usr/bin/env bash
set -euo pipefail


export ELECTRON_DISABLE_SECURITY_WARNINGS=true
# Run Next.js dev server and Electron together
concurrently -n "NEXT,ELECTRON" -c "yellow,blue" --kill-others "npm run dev" "electron ."
