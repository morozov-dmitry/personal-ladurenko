/**
 * API Configuration Service
 * 
 * Configures the API service with authentication and base URL.
 * Integrates with the auth service to automatically manage
 * authentication tokens and API configuration.
 * 
 * @class ApiConfigService
 * @example
 * ```javascript
 * import apiConfigService from '@/services/apiConfig.service'
 * 
 * // Initialize API configuration
 * await apiConfigService.initialize()
 * 
 * // The API service is now configured and ready to use
 * ```
 */
import { apiClient } from './api'
import authService from './auth.service'
import environmentService from './environment.service'

class ApiConfigService {
  constructor() {
    this.isInitialized = false
  }

  /**
   * Initialize API service configuration
   * 
   * Sets up base URL and authentication from environment and auth service.
   * Should be called once during app initialization.
   * 
   * @example
   * ```javascript
   * await apiConfigService.initialize()
   * ```
   */
  initialize() {
    // Set base URL from environment
    const baseUrl = environmentService.getApiBaseUrl()
    apiClient.setBaseUrl(baseUrl)

    // Apply current authentication if available
    this.applyCurrentAuth()

    this.isInitialized = true
    console.log('API service initialized with base URL:', baseUrl)
  }

  /**
   * Apply current authentication to API service
   * 
   * Gets the current token from auth service and applies it to API service.
   * Should be called after login or token refresh.
   * 
   * @example
   * ```javascript
   * apiConfigService.applyCurrentAuth()
   * ```
   */
  applyCurrentAuth() {
    const token = authService.getToken()

    if (token && authService.isAuthenticated()) {
      // Set the token in the API client
      apiClient.setToken(token)
      console.log('Authentication applied to API service')
    } else {
      apiClient.clearToken()
      console.log('Authentication cleared from API service')
    }
  }

  /**
   * Clear authentication from API service
   * 
   * Removes authentication from API service.
   * Should be called during logout.
   * 
   * @example
   * ```javascript
   * apiConfigService.clearAuth()
   * ```
   */
  clearAuth() {
    apiClient.clearToken()
    console.log('Authentication cleared from API service')
  }

  /**
   * Update base URL
   * 
   * @param {string} baseUrl - New base URL
   * @example
   * ```javascript
   * apiConfigService.updateBaseUrl('https://api.example.com')
   * ```
   */
  updateBaseUrl(baseUrl) {
    apiClient.setBaseUrl(baseUrl)
    console.log('API base URL updated to:', baseUrl)
  }

  /**
   * Get API client instance
   * 
   * @returns {ApiClient} Configured API client instance
   * @example
   * ```javascript
   * const api = apiConfigService.getApiClient()
   * const data = await api.get('/users')
   * ```
   */
  getApiClient() {
    if (!this.isInitialized) {
      console.warn('API service not initialized. Call initialize() first.')
    }
    return apiClient
  }

  /**
   * Check if API service is initialized
   * 
   * @returns {boolean} True if initialized
   * @example
   * ```javascript
   * if (apiConfigService.isInitialized()) {
   *   // Use API service
   * }
   * ```
   */
  isInitialized() {
    return this.isInitialized
  }

  /**
   * Get current API configuration
   * 
   * @returns {Object} Current API configuration
   * @example
   * ```javascript
   * const config = apiConfigService.getConfig()
   * console.log('Base URL:', config.baseUrl)
   * console.log('Authenticated:', config.isAuthenticated)
   * ```
   */
  getConfig() {
    return {
      baseUrl: apiClient.getBaseUrl(),
      isAuthenticated: apiClient.isAuthenticated(),
      authInfo: apiClient.getAuthInfo(),
      isInitialized: this.isInitialized
    }
  }
}

// Create singleton instance
const apiConfigService = new ApiConfigService()

export default apiConfigService
