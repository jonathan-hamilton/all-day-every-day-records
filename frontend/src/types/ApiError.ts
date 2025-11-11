/**
 * API error type definitions for consistent error handling
 */

/**
 * Base API error structure
 */
export interface ApiError {
  message: string;
  code?: number;
  status?: number;
  details?: unknown;
  timestamp: string;
  path?: string;
}

/**
 * Network/connection errors
 */
export interface NetworkError extends ApiError {
  type: 'network';
  isTimeout: boolean;
  isOffline: boolean;
}

/**
 * HTTP response errors (4xx, 5xx)
 */
export interface HttpError extends ApiError {
  type: 'http';
  status: number;
  statusText: string;
  response?: {
    data?: unknown;
    headers?: Record<string, string>;
  };
}

/**
 * Validation errors from backend
 */
export interface ValidationError extends ApiError {
  type: 'validation';
  field?: string;
  violations: Array<{
    field: string;
    message: string;
    code?: string;
  }>;
}

/**
 * Authentication/authorization errors
 */
export interface AuthError extends ApiError {
  type: 'auth';
  isExpired: boolean;
  requiresLogin: boolean;
}

/**
 * CORS errors
 */
export interface CorsError extends ApiError {
  type: 'cors';
  origin?: string;
}

/**
 * Union type for all possible API errors
 */
export type ApiErrorType = NetworkError | HttpError | ValidationError | AuthError | CorsError;

/**
 * Error handler configuration
 */
export interface ErrorHandlerConfig {
  showUserMessage: boolean;
  logToConsole: boolean;
  retryable: boolean;
  retryAttempts?: number;
}