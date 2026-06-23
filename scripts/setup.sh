# !/bin/bash

set -e

# Setup and start the project
cd "$(dirname "$0")"/..
cd ./web && pnpm install
echo "✅ Web dependencies installed"

# Must run after pnpm install — husky's prepare script resets hooksPath
cd ..
git config core.hooksPath .githooks
echo "✅ Git hooks configured"
