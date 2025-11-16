/**
 * Type definitions for All Day Every Day Records Frontend
 * 
 * This file exports all TypeScript types and interfaces used throughout the application.
 * Types are organized by domain (Artist, Release, Label, etc.) for maintainability.
 */

// Artist types
export type { Artist, ReleaseArtist } from './Artist';

// Label types  
export type { Label } from './Label';

// Streaming link types
export type { StreamingLink } from './StreamingLink';

// Release types
export type { 
  Release, 
  ReleaseWithDetails, 
  ReleaseOverview, 
  ReleaseFormData, 
  ReleaseCarouselSlide,
  ReleaseType, 
  ReleaseStatus,
  ReleaseTag
} from './Release';

// Authentication types
export type {
  User,
  AuthState,
  AuthContextType,
  LoginCredentials,
  LoginResponse,
  LogoutResponse
} from './Auth';

// API response types
export type { 
  ApiResponse, 
  ApiListResponse, 
  ApiSingleResponse, 
  HealthCheckResponse 
} from './ApiResponse';

// API error types
export type { 
  ApiError, 
  ApiErrorType, 
  NetworkError, 
  HttpError, 
  ValidationError, 
  AuthError, 
  CorsError, 
  ErrorHandlerConfig 
} from './ApiError';