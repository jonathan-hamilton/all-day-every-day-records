/**
 * Authentication API Service for All Day Every Day Records
 * 
 * Handles authentication-related API calls including login, logout, and session management.
 * Uses factory pattern for service creation and integrates with existing backend endpoints.
 */

import type { ApiService } from './apiService';
import type { LoginCredentials, LoginResponse, LogoutResponse, User } from '../types/Auth';

export class AuthService {
  constructor(private readonly apiService: ApiService) {}

  /**
   * Authenticate user with username and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await this.apiService.post<LoginResponse>('/login.php', {
        username: credentials.username,
        password: credentials.password
      });

      // Backend returns success/error structure
      if (response && typeof response === 'object') {
        if ('success' in response && response.success) {
          return response;
        } else if ('error' in response) {
          return {
            success: false,
            message: response.error || 'Login failed',
            error: response.error
          };
        }
      }

      // Fallback for unexpected response format
      return {
        success: false,
        message: 'Invalid response format',
        error: 'Unexpected server response'
      };

    } catch (error) {
      console.error('Authentication API error:', error);
      
      // Handle different error types
      if (error && typeof error === 'object' && 'message' in error) {
        return {
          success: false,
          message: error.message as string,
          error: error.message as string
        };
      }

      return {
        success: false,
        message: 'Network error - please check your connection',
        error: 'Network error'
      };
    }
  }

  /**
   * Logout current user and clear session
   */
  async logout(): Promise<LogoutResponse> {
    try {
      // Note: Backend may not have logout endpoint yet, 
      // but we'll prepare for it in case it exists
      const response = await this.apiService.post<LogoutResponse>('/logout.php', {});
      
      if (response && typeof response === 'object' && 'success' in response) {
        return response;
      }

      // Return success even if endpoint doesn't exist yet
      return {
        success: true,
        message: 'Logged out successfully'
      };

    } catch (error) {
      console.warn('Logout API error (may be expected if endpoint not implemented):', error);
      
      // For now, we'll consider logout successful even if API fails
      // since frontend session cleanup is what matters most
      return {
        success: true,
        message: 'Logged out successfully'
      };
    }
  }

  /**
   * Validate current session (future enhancement)
   */
  async validateSession(): Promise<{ valid: boolean; user?: User }> {
    try {
      // This endpoint doesn't exist yet, but we'll prepare for future implementation
      const response = await this.apiService.get<{ user: User }>('/validate-session.php');
      
      if (response && typeof response === 'object' && 'user' in response) {
        return {
          valid: true,
          user: response.user
        };
      }

      return { valid: false };

    } catch {
      // Session validation failure is expected for now
      console.debug('Session validation not available (expected in development)');
      return { valid: false };
    }
  }
}

/**
 * Factory function to create AuthService instance
 */
export function createAuthService(apiService: ApiService): AuthService {
  return new AuthService(apiService);
}