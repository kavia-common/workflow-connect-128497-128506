//
// PUBLIC_INTERFACE
// Authentication API helper functions.
// Endpoints are placeholders; integrate with backend routes when available.
//
import { httpGet, httpPost } from './http';

const AUTH_BASE = '/auth';

/**
 * PUBLIC_INTERFACE
 * Login with email and password.
 * Expects backend to return { token, user }
 * @param {{ email: string, password: string }} payload
 */
export async function login(payload) {
  return httpPost(`${AUTH_BASE}/login`, payload);
}

/**
 * PUBLIC_INTERFACE
 * Register a new user.
 * Expects backend to return { token, user }
 * @param {{ email: string, password: string, name?: string }} payload
 */
export async function register(payload) {
  return httpPost(`${AUTH_BASE}/register`, payload);
}

/**
 * PUBLIC_INTERFACE
 * Fetch the currently authenticated user's profile.
 * @returns {Promise<{ ok: boolean, status: number, data: any }>}
 */
export async function getProfile() {
  return httpGet(`${AUTH_BASE}/me`);
}

/**
 * PUBLIC_INTERFACE
 * Logout (client-side only, unless backend supports token invalidation).
 */
export async function logout() {
  // If backend supports logout, call: await httpPost(`${AUTH_BASE}/logout`, {});
  return { ok: true, status: 200, data: { success: true } };
}

/**
 * PUBLIC_INTERFACE
 * OAuth scaffolding functions for future integration.
 */
export function getOAuthProviders() {
  // Placeholder: return available providers from backend when ready.
  return Promise.resolve({
    ok: true,
    status: 200,
    data: { providers: ['google', 'github'] },
  });
}

export function getOAuthUrl(provider, opts = {}) {
  // Typically the backend provides a redirect URL and state.
  // Example endpoint: /auth/oauth/:provider/url
  return Promise.resolve({
    ok: true,
    status: 200,
    data: { url: `${process.env.REACT_APP_API_BASE_URL || ''}/auth/oauth/${provider}/start` , ...opts },
  });
}
