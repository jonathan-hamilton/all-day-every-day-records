/**
 * Simplified Authentication Context for All Day Every Day Records
 * Based on reference N&D pattern - session-based authentication only
 */

import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, User } from '../types/Auth';

// Create authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      // Try to get user info from backend session
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/get-user-info.php`, {
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
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login.php`, {
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
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/logout.php`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      console.log('Logout request failed, clearing local state anyway');
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
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