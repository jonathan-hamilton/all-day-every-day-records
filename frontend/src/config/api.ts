/**
 * API Configuration for Frontend-Backend Integration
 * 
 * Provides environment-based API configuration for development and production.
 * Follows the Factory Pattern for service creation.
 */

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  headers: Record<string, string>;
}

export type Environment = 'development' | 'production';

/**
 * Environment-specific API configurations
 */
const configurations: Record<Environment, ApiConfig> = {
  development: {
    // Use environment variable if set, otherwise default to production for local testing
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://alldayeverydayrecords.com/api',
    timeout: 10000, // 10 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  },
  production: {
    baseURL: 'https://alldayeverydayrecords.com/api',
    timeout: 10000, // 10 seconds 
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
};

/**
 * Get the current environment based on Vite's NODE_ENV
 */
export const getCurrentEnvironment = (): Environment => {
  // In Vite, import.meta.env.MODE is 'development' or 'production'
  const mode = import.meta.env.MODE;
  return mode === 'production' ? 'production' : 'development';
};

/**
 * Factory function to get API configuration for specified environment
 */
export const getApiConfig = (environment?: Environment): ApiConfig => {
  const env = environment || getCurrentEnvironment();
  return configurations[env];
};

/**
 * Get the current API configuration
 */
export const getCurrentApiConfig = (): ApiConfig => {
  return getApiConfig();
};

/**
 * Validate if the current environment is development
 */
export const isDevelopment = (): boolean => {
  return getCurrentEnvironment() === 'development';
};

/**
 * Validate if the current environment is production
 */
export const isProduction = (): boolean => {
  return getCurrentEnvironment() === 'production';
};