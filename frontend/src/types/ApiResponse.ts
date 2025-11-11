/**
 * Generic API response wrapper
 * Provides consistent structure for all API responses
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

/**
 * API response for list/collection endpoints
 * Includes pagination and metadata information
 */
export interface ApiListResponse<T> extends ApiResponse<T[]> {
  meta: {
    total: number;
    count: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

/**
 * API response for single entity endpoints
 * Wraps individual entity data
 */
export interface ApiSingleResponse<T> extends ApiResponse<T> {
  meta?: {
    cached?: boolean;
    lastModified?: string;
  };
}

/**
 * Health check response structure
 */
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  database: {
    connected: boolean;
    responseTime?: number;
  };
  api: {
    version: string;
    environment: string;
  };
}