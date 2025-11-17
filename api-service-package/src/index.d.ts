/**
 * @uecsio/api-service TypeScript Definitions
 * 
 * @version 1.0.0
 * @author UECSIO Development Team
 * @license MIT
 */

/**
 * Authentication information object
 */
export interface AuthInfo {
  [key: string]: string | number | boolean;
}

/**
 * Additional headers object
 */
export interface AdditionalHeaders {
  [key: string]: string | number | boolean;
}

/**
 * Request body data
 */
export type RequestData = Record<string, any> | null;

/**
 * API Service Class
 * 
 * Centralized service for making authenticated API requests.
 * Handles base URL configuration, authentication, and provides
 * methods for all HTTP operations (GET, POST, PATCH, DELETE).
 */
export declare class ApiService {
  /**
   * Create a new ApiService instance
   */
  constructor();

  /**
   * Set the base URL for API requests
   * 
   * @param url - Base URL for API endpoints
   */
  setBaseUrl(url: string): void;

  /**
   * Apply authentication information
   * 
   * @param auth - Authentication object containing headers
   */
  applyAuthInfo(auth: AuthInfo): void;

  /**
   * Make GET request
   * 
   * @param path - API endpoint path
   * @param additionalHeaders - Additional headers to include
   * @returns Promise with response data
   */
  get(path: string, additionalHeaders?: AdditionalHeaders): Promise<any>;

  /**
   * Make POST request
   * 
   * @param path - API endpoint path
   * @param data - Request body data
   * @param additionalHeaders - Additional headers to include
   * @returns Promise with response data
   */
  post(path: string, data?: RequestData, additionalHeaders?: AdditionalHeaders): Promise<any>;

  /**
   * Make PATCH request
   * 
   * @param path - API endpoint path
   * @param data - Request body data
   * @param additionalHeaders - Additional headers to include
   * @returns Promise with response data
   */
  patch(path: string, data?: RequestData, additionalHeaders?: AdditionalHeaders): Promise<any>;

  /**
   * Make DELETE request
   * 
   * @param path - API endpoint path
   * @returns Promise with response data
   */
  delete(path: string): Promise<any>;

  /**
   * Make PUT request
   * 
   * @param path - API endpoint path
   * @param data - Request body data
   * @param additionalHeaders - Additional headers to include
   * @returns Promise with response data
   */
  put(path: string, data?: RequestData, additionalHeaders?: AdditionalHeaders): Promise<any>;

  /**
   * Upload file with FormData
   * 
   * @param path - API endpoint path
   * @param formData - Form data containing file
   * @param additionalHeaders - Additional headers to include
   * @returns Promise with response data
   */
  upload(path: string, formData: FormData, additionalHeaders?: AdditionalHeaders): Promise<any>;

  /**
   * Get current base URL
   * 
   * @returns Current base URL
   */
  getBaseUrl(): string;

  /**
   * Get current authentication info
   * 
   * @returns Current authentication info or null
   */
  getAuthInfo(): AuthInfo | null;

  /**
   * Clear authentication info
   */
  clearAuthInfo(): void;

  /**
   * Check if authenticated
   * 
   * @returns True if has valid authentication
   */
  isAuthenticated(): boolean;
}

/**
 * Create a singleton instance of ApiService
 * 
 * @returns Singleton ApiService instance
 */
export declare function createApiService(): ApiService;

/**
 * Default singleton instance
 */
declare const apiService: ApiService;

export default apiService;
