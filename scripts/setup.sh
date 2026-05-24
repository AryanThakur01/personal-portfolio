# inside scripts/setup.sh
git config core.hooksPath .githooks
echo "✅ Git hooks configured"

# Install node, nvm, project supported node version
nvm install v24.16.0 && nvm use v24.16.0
echo "✅ Node.js v24.16.0 installed and set as default"

# Setup and start the project
cd ./web && pnpm install
echo "✅ Web dependencies installed"
