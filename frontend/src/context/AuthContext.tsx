/**
 * Authentication Context for All Day Every Day Records
 * 
 * This file provides React Context for global authentication state management.
 * Handles user authentication, session persistence, and authentication state
 * across the application using localStorage for session persistence.
 */

import React, { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, AuthState, User } from '../types/Auth';
import { createServices } from '../services';

// Create authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication context provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Local storage key for session persistence
const AUTH_STORAGE_KEY = 'ader_auth_session';

// Helper function to get stored auth session
const getStoredAuthSession = (): { user: User | null; isAuthenticated: boolean } => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const session = JSON.parse(stored);
      // Validate session structure
      if (session && session.user && typeof session.user.username === 'string') {
        return {
          user: session.user,
          isAuthenticated: true
        };
      }
    }
  } catch (error) {
    console.warn('Failed to parse stored auth session:', error);
    // Clear invalid stored data
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  
  return {
    user: null,
    isAuthenticated: false
  };
};

// Helper function to store auth session
const storeAuthSession = (user: User | null) => {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user }));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (error) {
    console.warn('Failed to store auth session:', error);
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize auth state with stored session
  const [authState, setAuthState] = useState<AuthState>(() => {
    const stored = getStoredAuthSession();
    return {
      user: stored.user,
      isAuthenticated: stored.isAuthenticated,
      isLoading: false,
      error: null
    };
  });

  // Login function - now with real API integration
  const login = async (username: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Use factory pattern to get auth service
      const services = createServices();
      const response = await services.auth.login({ username, password });
      
      if (response.success && response.user) {
        // Create user object with session data
        const user: User = {
          id: 1, // Backend response may not include ID in development mode
          username: response.user.username,
          is_admin: response.user.is_admin,
          login_time: Date.now()
        };

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });

        return true;
      } else {
        // Login failed
        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: response.message || 'Login failed'
        }));
        
        return false;
      }

    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      
      return false;
    }
  };

  // Logout function with API integration
  const logout = async () => {
    try {
      // Call logout API (gracefully handles if endpoint doesn't exist)
      const services = createServices();
      await services.auth.logout();
    } catch (error) {
      console.warn('Logout API call failed (expected in development):', error);
    } finally {
      // Always clear local state regardless of API response
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
      storeAuthSession(null);
    }
  };

  // Clear error function
  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  // Update localStorage when auth state changes
  useEffect(() => {
    storeAuthSession(authState.user);
  }, [authState.user]);

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;