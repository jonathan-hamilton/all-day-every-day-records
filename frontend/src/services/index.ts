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
export type { GetReleasesParams } from './releaseService';

// Export types for convenience
export type { ReleaseCarouselSlide } from '../types';

// Service factory to create configured service instances
import { getCurrentApiConfig } from '../config/api';
import { createApiService } from './apiService';
import { createReleaseService } from './releaseService';

/**
 * Create a configured API service instance using current environment
 */
export function createConfiguredApiService() {
  const config = getCurrentApiConfig();
  return createApiService(config);
}

/**
 * Create a complete set of configured services
 */
export function createServices() {
  const apiService = createConfiguredApiService();
  
  return {
    api: apiService,
    releases: createReleaseService(apiService)
  };
}