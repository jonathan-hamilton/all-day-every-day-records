/**
 * Simplified Authentication Context for All Day Every Day Records
 * Based on reference N&D pattern - session-based authentication only
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, User } from '../types/Auth';
import { getCurrentApiConfig } from '../config/api';
import { setGlobalCsrfTokenGetter } from '../services';

// Create authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  // Get API configuration
  const apiConfig = getCurrentApiConfig();

  // Set up CSRF token getter for API service
  useEffect(() => {
    setGlobalCsrfTokenGetter(() => csrfToken);
  }, [csrfToken]);

  const checkAuthStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Try to get user info from backend session
      const response = await fetch(`${apiConfig.baseURL}/get-user-info.php`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        }
      }
    } catch {
      console.log('No existing session found');
    } finally {
      setIsLoading(false);
    }
  }, [apiConfig.baseURL]);

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${apiConfig.baseURL}/login.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        // Store CSRF token from login response
        if (data.csrfToken) {
          setCsrfToken(data.csrfToken);
        }
        return true;
      } else {
        setError(data.error || 'Login failed');
        return false;
      }
    } catch {
      setError('Network error during login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to clear session
      await fetch(`${apiConfig.baseURL}/logout.php`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      console.log('Logout request failed, clearing local state anyway');
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      setCsrfToken(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    csrfToken,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;