import { API_BASE_URL } from '../constants';

/**
 * Thin central wrapper around the native `fetch`.
 *
 * All API calls should go through here so the base URL, default headers,
 * and any future global concerns (auth tokens, credentials, tracing, etc.)
 * live in one place instead of being scattered across api hooks.
 *
 * `path` is joined onto `API_BASE_URL`; pass a full `http(s)://` URL to opt out.
 */
export function _fetch(path: string, init?: RequestInit): Promise<Response> {
  const url = /^https?:\/\//.test(path) ? path : `${API_BASE_URL}${path}`;

  return fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
}
