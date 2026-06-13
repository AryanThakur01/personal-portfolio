/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GIT_SHA?: string;
  readonly VITE_DEPLOY_ENV?: string;
  readonly VITE_BUILD_TIME?: string;
  readonly VITE_BUILD_BRANCH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
