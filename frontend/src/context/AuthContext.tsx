import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthResponse, AuthUser } from '../types/auth.ts';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

interface AuthContextValue extends AuthState {
  setAuth: (payload: AuthResponse) => void;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'taskmate_auth';

const loadStoredAuth = (): AuthState => {
  if (typeof window === 'undefined') {
    return { user: null, token: null };
  }
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return { user: null, token: null };
    return JSON.parse(stored);
  } catch (error) {
    console.warn('Failed to parse auth storage', error);
    return { user: null, token: null };
  }
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => loadStoredAuth());

  const setAuth = useCallback((payload: AuthResponse) => {
    const nextState: AuthState = { user: payload.user, token: payload.token };
    setState(nextState);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState));
  }, []);

  const logout = useCallback(() => {
    setState({ user: null, token: null });
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ ...state, setAuth, logout }),
    [state, setAuth, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AUTH_STORAGE = AUTH_STORAGE_KEY;
