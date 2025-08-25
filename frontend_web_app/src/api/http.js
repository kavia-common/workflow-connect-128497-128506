//
// PUBLIC_INTERFACE
// Lightweight HTTP client wrapper around fetch with:
// - Base URL support (via env REACT_APP_API_BASE_URL)
// - JSON handling
// - Authorization header injection when token is present
// - Global 401 handling via optional logout callback
//

import { getItem, STORAGE_KEYS } from '../utils/storage';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

let onUnauthorized = null;

/**
 * PUBLIC_INTERFACE
 * Register a global unauthorized (401) handler. Typically used to trigger logout.
 * @param {(reason?: any) => void} handler
 */
export function registerUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

function getBaseUrl() {
  // Note: Ensure REACT_APP_API_BASE_URL is provided by environment when integrating backend.
  // Example: http://localhost:4000/api
  return process.env.REACT_APP_API_BASE_URL || '';
}

/**
 * Build headers with Authorization if token exists.
 */
function buildHeaders(extra = {}) {
  const token = getItem(STORAGE_KEYS.token);
  const auth = token ? { Authorization: `Bearer ${token}` } : {};
  return { ...DEFAULT_HEADERS, ...auth, ...extra };
}

/**
 * PUBLIC_INTERFACE
 * Perform an HTTP request.
 * @param {string} path - API path (relative or absolute)
 * @param {{ method?: string, headers?: any, body?: any, query?: Record<string, any> }} options
 * @returns {Promise<{ ok: boolean, status: number, data: any }>}
 */
export async function http(path, options = {}) {
  const { method = 'GET', headers, body, query } = options;

  const base = getBaseUrl();
  const isAbsolute = /^https?:\/\//i.test(path);
  let url = isAbsolute ? path : `${base}${path}`;

  // Query string
  if (query && typeof query === 'object') {
    const qs = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null) qs.append(k, String(v));
    });
    const sep = url.includes('?') ? '&' : '?';
    url = `${url}${sep}${qs.toString()}`;
  }

  const init = {
    method,
    headers: buildHeaders(headers),
  };
  if (body !== undefined) {
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(url, init);
  } catch (err) {
    return { ok: false, status: 0, data: { message: 'Network error', error: err } };
  }

  let data = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try { data = await res.json(); } catch { data = null; }
  } else {
    try { data = await res.text(); } catch { data = null; }
  }

  if (res.status === 401 && typeof onUnauthorized === 'function') {
    try { onUnauthorized({ status: res.status, data }); } catch { /* ignore */ }
  }

  return { ok: res.ok, status: res.status, data };
}

/**
 * PUBLIC_INTERFACE
 * Convenience methods
 */
export const httpGet = (path, options = {}) => http(path, { ...options, method: 'GET' });
export const httpPost = (path, body, options = {}) => http(path, { ...options, method: 'POST', body });
export const httpPut = (path, body, options = {}) => http(path, { ...options, method: 'PUT', body });
export const httpPatch = (path, body, options = {}) => http(path, { ...options, method: 'PATCH', body });
export const httpDelete = (path, options = {}) => http(path, { ...options, method: 'DELETE' });
