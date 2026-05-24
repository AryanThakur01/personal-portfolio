const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Metro only watches the app's own directory by default.
// In a monorepo, shared packages (e.g. @repo/ui) live outside the app directory,
// so Metro won't detect changes in them — breaking Fast Refresh and hot reload.
// This config extends Metro to watch the entire monorepo and resolve packages correctly.

// __dirname is the mobile app's directory (apps/mobile)
const projectRoot = __dirname;

// Walk up two levels to reach the monorepo root (personal-portfolio/project)
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Tell Metro to also watch the monorepo root.
// This makes Fast Refresh work when you edit files in packages/ui or any other shared package.
config.watchFolders = [monorepoRoot];

// Tell Metro where to look when resolving node_modules.
// Without this, Metro may find two copies of the same package (one in the app,
// one in the monorepo root) and crash with a duplicate module error.
// Listing the app's node_modules first ensures local overrides take precedence.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),  // app-level deps (takes priority)
  path.resolve(monorepoRoot, "node_modules"), // monorepo-level shared deps
];

module.exports = config;
