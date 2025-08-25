import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { clearAuth, loadAuth, persistAuth } from '../utils/storage';
import { login as apiLogin, register as apiRegister, getProfile as apiGetProfile, logout as apiLogout } from '../api/authApi';
import { registerUnauthorizedHandler } from '../api/http';

// PUBLIC_INTERFACE
export const AuthContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * AuthProvider manages the authenticated user state and token persistence.
 * - Loads saved token/user on init
 * - Exposes login/register/logout methods
 * - Registers a global 401 handler to auto-logout
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Load persisted auth on mount
  useEffect(() => {
    const { token: savedToken, user: savedUser } = loadAuth();
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(savedUser);
    setInitializing(false);
  }, []);

  // Register global 401 handler
  useEffect(() => {
    registerUnauthorizedHandler(() => {
      // Auto logout when token is invalid/expired
      doLogout();
    });
    // No cleanup required for this simple registration in this app scope
    // If needed, we could allow resetting the handler.
  }, []);

  const doLogin = useCallback(async (email, password) => {
    const res = await apiLogin({ email, password });
    if (res.ok && res.data) {
      const { token: tkn, user: usr } = res.data;
      if (tkn) setToken(tkn);
      if (usr) setUser(usr);
      persistAuth({ token: tkn, user: usr });
    }
    return res;
  }, []);

  const doRegister = useCallback(async (email, password) => {
    const res = await apiRegister({ email, password });
    if (res.ok && res.data) {
      const { token: tkn, user: usr } = res.data;
      if (tkn) setToken(tkn);
      if (usr) setUser(usr);
      persistAuth({ token: tkn, user: usr });
    }
    return res;
  }, []);

  const refreshProfile = useCallback(async () => {
    const res = await apiGetProfile();
    if (res.ok && res.data) {
      setUser(res.data);
      persistAuth({ token, user: res.data });
    }
    return res;
  }, [token]);

  const doLogout = useCallback(async () => {
    try { await apiLogout(); } catch { /* ignore */ }
    setToken(null);
    setUser(null);
    clearAuth();
  }, []);

  const value = useMemo(
    () => ({
      initializing,
      isAuthenticated: !!token,
      token,
      user,
      login: doLogin,
      register: doRegister,
      logout: doLogout,
      refreshProfile,
    }),
    [initializing, token, user, doLogin, doRegister, doLogout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * Hook to access the AuthContext.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
