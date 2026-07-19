export const WEBSITE_URL = import.meta.env.DEV
  ? 'http://localhost:5173'
  : 'https://www.aryanthakur.dev';

export const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:3000/api/v1'
  : 'https://dckxidqtxgc25alxwbos76hrfe0qdemy.lambda-url.ap-south-1.on.aws/api/v1';

// Default staleTime (ms) applied to all GET queries via the QueryClient.
export const DEFAULT_QUERY_STALE_TIME = 60 * 1000;
