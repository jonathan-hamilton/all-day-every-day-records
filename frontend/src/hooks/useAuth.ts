/**
 * useAuth Hook for All Day Every Day Records
 * 
 * Custom React hook for accessing authentication context throughout the application.
 * Provides type-safe access to authentication state and methods.
 */

import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import type { AuthContextType } from '../types/Auth';

/**
 * Custom hook to access authentication context
 * Must be used within an AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};