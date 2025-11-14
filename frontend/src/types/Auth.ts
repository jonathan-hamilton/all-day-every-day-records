/**
 * Authentication types for All Day Every Day Records
 * 
 * This file defines TypeScript interfaces for authentication-related data structures
 * used throughout the authentication system including user data, auth state, and context.
 */

export interface User {
  id: number;
  username: string;
  is_admin: boolean;
  login_time?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    username: string;
    is_admin: boolean;
  };
  error?: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}