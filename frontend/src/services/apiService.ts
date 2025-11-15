/**
 * Core API Service Layer
 * 
 * Provides centralized API communication with the PHP backend.
 * Implements the Service Layer Pattern with axios client configuration,
 * request/response interceptors, error handling, and retry logic.
 */

import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import type { ApiConfig } from '../config/api';
import type { 
  ApiErrorType, 
  NetworkError, 
  HttpError, 
  CorsError, 
  HealthCheckResponse 
} from '../types';

/**
 * Request retry configuration
 */
interface RetryConfig {
  attempts: number;
  delay: number;
  backoffMultiplier: number;
  retryCondition: (error: AxiosError) => boolean;
}

/**
 * Core API service class implementing the Service Layer pattern
 */
export class ApiService {
  private readonly client: AxiosInstance;
  private readonly retryConfig: RetryConfig;
  private getDevToken?: () => string | null;

  constructor(config: ApiConfig) {
    // Create axios instance with configuration
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        ...config.headers,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    // Setup retry configuration
    this.retryConfig = {
      attempts: config.retryAttempts,
      delay: config.retryDelay,
      backoffMultiplier: 1.5,
      retryCondition: (error: AxiosError) => {
        // Retry on network errors or 5xx server errors
        return !error.response || (error.response.status >= 500);
      }
    };

    // Setup interceptors
    this.setupRequestInterceptors();
    this.setupResponseInterceptors();
  }

  /**
   * Set the function to get dev_token for authenticated requests
   */
  setDevTokenGetter(getToken: () => string | null): void {
    this.getDevToken = getToken;
  }

  /**
   * Setup request interceptors for logging and authentication
   */
  private setupRequestInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        // Add dev_token for authenticated requests
        if (this.getDevToken && config.url !== '/login.php' && config.url !== '/health.php') {
          const devToken = this.getDevToken();
          if (devToken) {
            // For POST requests, add to request body
            if (config.method === 'post' && config.data) {
              if (typeof config.data === 'string') {
                try {
                  const parsed = JSON.parse(config.data);
                  parsed.dev_token = devToken;
                  config.data = JSON.stringify(parsed);
                } catch {
                  // If not JSON, try form data
                  if (config.data instanceof FormData) {
                    config.data.append('dev_token', devToken);
                  }
                }
              } else if (config.data instanceof FormData) {
                config.data.append('dev_token', devToken);
              } else if (typeof config.data === 'object') {
                config.data.dev_token = devToken;
              }
            }
          }
        }

        // Log requests in development
        if (import.meta.env.MODE === 'development') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
            headers: config.headers,
            data: config.data,
            params: config.params
          });
        }

        // Add timestamp to track request duration
        config.metadata = { startTime: Date.now() };
        return config;
      },
      (error) => {
        console.error('❌ Request setup failed:', error);
        return Promise.reject(this.createApiError(error));
      }
    );
  }

  /**
   * Setup response interceptors for logging, error handling, and retry logic
   */
  private setupResponseInterceptors(): void {
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log successful responses in development
        if (import.meta.env.MODE === 'development') {
          const duration = Date.now() - (response.config.metadata?.startTime || Date.now());
          console.log(`✅ API Response: ${response.status} ${response.config.url} (${duration}ms)`, {
            data: response.data,
            headers: response.headers
          });
        }

        return response;
      },
      async (error: AxiosError) => {
        // Log errors in development
        if (import.meta.env.MODE === 'development') {
          const duration = Date.now() - (error.config?.metadata?.startTime || Date.now());
          console.error(`❌ API Error: ${error.response?.status || 'Network'} ${error.config?.url} (${duration}ms)`, error);
        }

        // Implement retry logic
        if (this.shouldRetry(error)) {
          return this.retryRequest(error);
        }

        // Convert to standardized API error
        throw this.createApiError(error);
      }
    );
  }

  /**
   * Determine if a request should be retried
   */
  private shouldRetry(error: AxiosError): boolean {
    const config = error.config as AxiosRequestConfig & { retryCount?: number };
    
    // Check retry count
    const retryCount = config.retryCount || 0;
    if (retryCount >= this.retryConfig.attempts) {
      return false;
    }

    // Check retry condition
    return this.retryConfig.retryCondition(error);
  }

  /**
   * Retry a failed request with exponential backoff
   */
  private async retryRequest(error: AxiosError): Promise<AxiosResponse> {
    const config = error.config as AxiosRequestConfig & { retryCount?: number };
    const retryCount = (config.retryCount || 0) + 1;
    
    // Calculate delay with exponential backoff
    const delay = this.retryConfig.delay * Math.pow(this.retryConfig.backoffMultiplier, retryCount - 1);
    
    console.log(`🔄 Retrying request (attempt ${retryCount}/${this.retryConfig.attempts}) after ${delay}ms...`);
    
    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Update retry count and retry
    config.retryCount = retryCount;
    return this.client.request(config);
  }

  /**
   * Convert axios errors to standardized API errors
   */
  private createApiError(error: AxiosError | Error): ApiErrorType {
    const timestamp = new Date().toISOString();
    
    if (axios.isAxiosError(error)) {
      // Network error
      if (!error.response) {
        const networkError: NetworkError = {
          type: 'network',
          message: error.message || 'Network error occurred',
          timestamp,
          isTimeout: error.code === 'ECONNABORTED',
          isOffline: !navigator.onLine,
          code: error.code === 'ECONNABORTED' ? 408 : 0
        };
        return networkError;
      }

      // CORS error
      if (error.response.status === 0 || error.message.includes('CORS')) {
        const corsError: CorsError = {
          type: 'cors',
          message: 'Cross-origin request blocked. Please check CORS configuration.',
          timestamp,
          code: 0,
          origin: window.location.origin
        };
        return corsError;
      }

      // HTTP error
      const httpError: HttpError = {
        type: 'http',
        message: error.response.data?.message || error.message || `HTTP ${error.response.status} error`,
        timestamp,
        status: error.response.status,
        statusText: error.response.statusText,
        response: {
          data: error.response.data,
          headers: error.response.headers as Record<string, string>
        }
      };
      return httpError;
    }

    // Generic error fallback
    const genericError: NetworkError = {
      type: 'network',
      message: error.message || 'An unexpected error occurred',
      timestamp,
      isTimeout: false,
      isOffline: false,
      details: error
    };
    return genericError;
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    try {
      const response = await this.client.get<HealthCheckResponse>('/health.php');
      return response.data;
    } catch {
      // Return unhealthy status if health check fails
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: {
          connected: false
        },
        api: {
          version: 'unknown',
          environment: import.meta.env.MODE
        }
      };
    }
  }

  /**
   * Generic GET request method
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * Generic POST request method
   */
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Generic PUT request method
   */
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Generic DELETE request method
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /**
   * File upload method using FormData
   * Automatically includes authentication tokens when available
   */
  async upload<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    return this.post<T>(url, formData, config);
  }

  /**
   * Get the underlying axios instance (use sparingly)
   */
  getClient(): AxiosInstance {
    return this.client;
  }
}

/**
 * Factory function to create API service instance
 * Implements the Factory Pattern for environment-based configuration
 */
export function createApiService(config: ApiConfig): ApiService {
  return new ApiService(config);
}

/**
 * Type augmentation to add metadata to axios config
 */
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
    retryCount?: number;
  }
}