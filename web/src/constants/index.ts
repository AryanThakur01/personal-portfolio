export const WEBSITE_URL = import.meta.env.DEV
  ? 'http://localhost:5173'
  : 'https://www.aryanthakur.dev';

export const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:3000/api/v1'
  : 'https://api.aryanthakur.dev';

// Default staleTime (ms) applied to all GET queries via the QueryClient.
export const DEFAULT_QUERY_STALE_TIME = 60 * 1000;
