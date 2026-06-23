# !/bin/bash

# Change directory to current directory
cd "$(dirname "$0")"
cd ../web

pnpm install
pnpm run dev
