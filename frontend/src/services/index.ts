/**
 * Service layer exports for All Day Every Day Records Frontend
 * 
 * This file exports all API services and configuration used throughout the application.
 * Services provide type-safe access to backend APIs following the Service Layer pattern.
 */

// Core API service and configuration
export { ApiService, createApiService } from './apiService';
export { getCurrentApiConfig, getApiConfig, isDevelopment, isProduction } from '../config/api';

// Domain-specific services
export { ReleaseService, createReleaseService } from './releaseService';
export { AuthService, createAuthService } from './authService';
export { VideoService, createVideoService } from './videoService';
export type { GetReleasesParams } from './releaseService';
export type { VideoFormData } from './videoService';

// Export types for convenience
export type { ReleaseCarouselSlide, Video, VideoWithRelated } from '../types';

// Service factory to create configured service instances
import { getCurrentApiConfig } from '../config/api';
import { createApiService } from './apiService';
import { createReleaseService } from './releaseService';
import { createAuthService } from './authService';
import { createVideoService } from './videoService';

// Global dev token getter for API service
let globalDevTokenGetter: (() => string | null) | null = null;
let globalCsrfTokenGetter: (() => string | null) | null = null;

/**
 * Set the global dev token getter (called from AuthContext)
 */
export function setGlobalDevTokenGetter(getter: () => string | null) {
  globalDevTokenGetter = getter;
  
  // Update existing API service instance if available
  if (globalApiServiceInstance) {
    globalApiServiceInstance.setDevTokenGetter(getter);
  }
}

/**
 * Set the global CSRF token getter (called from AuthContext)
 */
export function setGlobalCsrfTokenGetter(getter: () => string | null) {
  globalCsrfTokenGetter = getter;
  
  // Update existing API service instance if available
  if (globalApiServiceInstance) {
    globalApiServiceInstance.setCsrfTokenGetter(getter);
  }
}

// Global API service instance for reuse
let globalApiServiceInstance: ReturnType<typeof createApiService> | null = null;

/**
 * Create a configured API service instance using current environment
 */
export function createConfiguredApiService() {
  if (!globalApiServiceInstance) {
    const config = getCurrentApiConfig();
    globalApiServiceInstance = createApiService(config);
    
    // Set dev token getter if available
    if (globalDevTokenGetter) {
      globalApiServiceInstance.setDevTokenGetter(globalDevTokenGetter);
    }
    
    // Set CSRF token getter if available
    if (globalCsrfTokenGetter) {
      globalApiServiceInstance.setCsrfTokenGetter(globalCsrfTokenGetter);
    }
  }
  
  return globalApiServiceInstance;
}
/**
 * Create a complete set of configured services
 */
export function createServices() {
  const apiService = createConfiguredApiService();
  
  return {
    api: apiService,
    releases: createReleaseService(apiService),
    auth: createAuthService(apiService),
    videos: createVideoService(apiService)
  };
}