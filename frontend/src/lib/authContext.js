'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('corex_admin_token');
        const storedAdmin = localStorage.getItem('corex_admin_user');

        if (storedToken && storedAdmin) {
          setToken(storedToken);
          setAdmin(JSON.parse(storedAdmin));

          // Optionally verify in background
          api.getMe()
            .then((res) => {
              if (res.admin) {
                setAdmin(res.admin);
                localStorage.setItem('corex_admin_user', JSON.stringify(res.admin));
              }
            })
            .catch(() => {
              // Token likely expired
              logout();
            });
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.success && res.token) {
        setToken(res.token);
        setAdmin(res.admin);
        localStorage.setItem('corex_admin_token', res.token);
        localStorage.setItem('corex_admin_user', JSON.stringify(res.admin));
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return {
        success: false,
        message: err.data?.message || err.message || 'Network error occurred',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('corex_admin_token');
    localStorage.removeItem('corex_admin_user');
    setToken(null);
    setAdmin(null);
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      router.push('/admin/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: Boolean(token && admin),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
