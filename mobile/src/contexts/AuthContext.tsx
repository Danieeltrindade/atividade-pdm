import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { loginRequest, profileRequest } from '../api/auth';
import { getToken, removeToken, saveToken } from '../services/storage';
import { UserProfile } from '../types/auth';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextValue {
  user?: UserProfile;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    const token = await getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const profile = await profileRequest();
      setUser(profile);
    } catch (error) {
      await removeToken();
      setUser(undefined);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  async function login(credentials: LoginCredentials) {
    setLoading(true);
    const response = await loginRequest(credentials);
    await saveToken(response.token);
    setUser(response.user);
    setLoading(false);
  }

  async function logout() {
    await removeToken();
    setUser(undefined);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
