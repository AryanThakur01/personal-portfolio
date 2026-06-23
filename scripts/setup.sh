# !/bin/bash

set -e

# nvm is a shell function, not a binary — must be sourced explicitly in scripts
export NVM_DIR="$HOME/.nvm"
# shellcheck source=/dev/null
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

if ! command -v nvm &>/dev/null; then
  echo "❌ nvm not found. Install it first: https://github.com/nvm-sh/nvm"
  exit 1
fi

# Install node, nvm, project supported node version
nvm install v24.16.0
nvm use v24.16.0
echo "✅ Node.js v24.16.0 installed and set as default"

# Setup and start the project
cd "$(dirname "$0")"/..
cd ./web && pnpm install
echo "✅ Web dependencies installed"

# Must run after pnpm install — husky's prepare script resets hooksPath
cd ..
git config core.hooksPath .githooks
echo "✅ Git hooks configured"
