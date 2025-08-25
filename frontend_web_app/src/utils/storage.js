//
// PUBLIC_INTERFACE
// Minimal storage utilities for persisting auth state and preferences.
// Wraps localStorage usage with safe fallbacks for SSR/test environments.
//

/** Key names used for storage. */
export const STORAGE_KEYS = {
  token: 'auth_token',
  user: 'auth_user',
  theme: 'theme',
};

/**
 * Safely get a value from localStorage. Returns null when not available.
 * @param {string} key
 * @returns {string|null}
 */
export function getItem(key) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Safely set a value in localStorage. No-ops when not available.
 * @param {string} key
 * @param {string} value
 */
export function setItem(key, value) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

/**
 * Safely remove a value in localStorage. No-ops when not available.
 * @param {string} key
 */
export function removeItem(key) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/**
 * PUBLIC_INTERFACE
 * Persist auth data (JWT token and user profile).
 * @param {{ token?: string, user?: any }} param0
 */
export function persistAuth({ token, user }) {
  if (token != null) setItem(STORAGE_KEYS.token, token);
  if (user != null) setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

/**
 * PUBLIC_INTERFACE
 * Load auth data from storage.
 * @returns {{ token: string|null, user: any|null }}
 */
export function loadAuth() {
  const token = getItem(STORAGE_KEYS.token);
  const userRaw = getItem(STORAGE_KEYS.user);
  let user = null;
  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch {
    user = null;
  }
  return { token, user };
}

/**
 * PUBLIC_INTERFACE
 * Clear all auth data.
 */
export function clearAuth() {
  removeItem(STORAGE_KEYS.token);
  removeItem(STORAGE_KEYS.user);
}
