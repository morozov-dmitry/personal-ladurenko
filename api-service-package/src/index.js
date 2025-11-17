/**
 * @uecsio/api-service
 * 
 * A generic, flexible API service for making authenticated HTTP requests
 * with automatic error handling and response parsing.
 * 
 * @version 1.0.0
 * @author UECSIO Development Team
 * @license MIT
 */

/**
 * API Service Class
 * 
 * Centralized service for making authenticated API requests.
 * Handles base URL configuration, authentication, and provides
 * methods for all HTTP operations (GET, POST, PATCH, DELETE).
 * 
 * @class ApiService
 * @example
 * ```javascript
 * import { ApiService } from '@uecsio/api-service'
 * 
 * const apiService = new ApiService()
 * 
 * // Set base URL
 * apiService.setBaseUrl('http://localhost:3000/api')
 * 
 * // Apply authentication
 * apiService.applyAuthInfo({
 *   'Authorization': 'Bearer jwt-token'
 * })
 * 
 * // Make requests
 * const data = await apiService.get('/users')
 * const user = await apiService.post('/users', userData)
 * ```
 */
export class ApiService {
  /**
   * Create a new ApiService instance
   */
  constructor() {
    this.baseUrl = ''
    this.authInfo = null
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }

  /**
   * Set the base URL for API requests
   * 
   * @param {string} url - Base URL for API endpoints
   * @example
   * ```javascript
   * apiService.setBaseUrl('http://localhost:3000/api')
   * ```
   */
  setBaseUrl(url) {
    this.baseUrl = url.replace(/\/$/, '') // Remove trailing slash
  }

  /**
   * Apply authentication information
   * 
   * @param {Object} auth - Authentication object containing headers
   * @example
   * ```javascript
   * apiService.applyAuthInfo({ 
   *   'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
   *   'X-Custom-Auth': 'value'
   * })
   * ```
   */
  applyAuthInfo(auth) {
    this.authInfo = auth
  }

  /**
   * Get authentication headers
   * 
   * @returns {Object} Headers object with authentication
   * @private
   */
  getAuthHeaders() {
    const headers = { ...this.defaultHeaders }

    if (this.authInfo) {
      // Apply auth info directly - let the caller decide the structure
      if (typeof this.authInfo === 'object') {
        Object.assign(headers, this.authInfo)
      }
    }

    return headers
  }

  /**
   * Build full URL from path
   * 
   * @param {string} path - API endpoint path
   * @returns {string} Full URL
   * @private
   */
  buildUrl(path) {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${this.baseUrl}${cleanPath}`
  }

  /**
   * Handle fetch response and errors
   * 
   * @param {Response} response - Fetch response
   * @returns {Promise<any>} Parsed response data
   * @private
   */
  async handleResponse(response) {
    if (!response.ok) {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        console.warn('Authentication failed')
        // Clear auth info on 401
        this.authInfo = null
        throw new Error('Authentication required')
      }

      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        // If response is not JSON, use status text
      }

      throw new Error(errorMessage)
    }

    // Parse JSON response
    try {
      return await response.json()
    } catch (e) {
      // If response is not JSON, return empty object
      return {}
    }
  }

  /**
   * Make GET request
   * 
   * @param {string} path - API endpoint path
   * @param {Object} additionalHeaders - Additional headers to include
   * @returns {Promise<any>} Response data
   * @example
   * ```javascript
   * const users = await apiService.get('/users')
   * const user = await apiService.get('/users/123', { 'X-Custom': 'value' })
   * ```
   */
  async get(path, additionalHeaders = {}) {
    const url = this.buildUrl(path)
    const headers = {
      ...this.getAuthHeaders(),
      ...additionalHeaders
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers
      })

      return await this.handleResponse(response)
    } catch (error) {
      console.error(`GET ${path} failed:`, error)
      throw error
    }
  }

  /**
   * Make POST request
   * 
   * @param {string} path - API endpoint path
   * @param {Object} data - Request body data
   * @param {Object} additionalHeaders - Additional headers to include
   * @returns {Promise<any>} Response data
   * @example
   * ```javascript
   * const user = await apiService.post('/users', { name: 'John', email: 'john@example.com' })
   * const result = await apiService.post('/users', userData, { 'X-Custom': 'value' })
   * ```
   */
  async post(path, data, additionalHeaders = {}) {
    const url = this.buildUrl(path)
    const headers = {
      ...this.getAuthHeaders(),
      ...additionalHeaders
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: data ? JSON.stringify(data) : undefined
      })

      return await this.handleResponse(response)
    } catch (error) {
      console.error(`POST ${path} failed:`, error)
      throw error
    }
  }

  /**
   * Make PATCH request
   * 
   * @param {string} path - API endpoint path
   * @param {Object} data - Request body data
   * @param {Object} additionalHeaders - Additional headers to include
   * @returns {Promise<any>} Response data
   * @example
   * ```javascript
   * const user = await apiService.patch('/users/123', { name: 'John Updated' })
   * const result = await apiService.patch('/users/123', userData, { 'X-Custom': 'value' })
   * ```
   */
  async patch(path, data, additionalHeaders = {}) {
    const url = this.buildUrl(path)
    const headers = {
      ...this.getAuthHeaders(),
      ...additionalHeaders
    }

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers,
        body: data ? JSON.stringify(data) : undefined
      })

      return await this.handleResponse(response)
    } catch (error) {
      console.error(`PATCH ${path} failed:`, error)
      throw error
    }
  }

  /**
   * Make DELETE request
   * 
   * @param {string} path - API endpoint path
   * @returns {Promise<any>} Response data
   * @example
   * ```javascript
   * await apiService.delete('/users/123')
   * ```
   */
  async delete(path) {
    const url = this.buildUrl(path)
    const headers = this.getAuthHeaders()

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers
      })

      return await this.handleResponse(response)
    } catch (error) {
      console.error(`DELETE ${path} failed:`, error)
      throw error
    }
  }

  /**
   * Make PUT request
   * 
   * @param {string} path - API endpoint path
   * @param {Object} data - Request body data
   * @param {Object} additionalHeaders - Additional headers to include
   * @returns {Promise<any>} Response data
   * @example
   * ```javascript
   * const user = await apiService.put('/users/123', userData)
   * ```
   */
  async put(path, data, additionalHeaders = {}) {
    const url = this.buildUrl(path)
    const headers = {
      ...this.getAuthHeaders(),
      ...additionalHeaders
    }

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: data ? JSON.stringify(data) : undefined
      })

      return await this.handleResponse(response)
    } catch (error) {
      console.error(`PUT ${path} failed:`, error)
      throw error
    }
  }

  /**
   * Upload file with FormData
   * 
   * @param {string} path - API endpoint path
   * @param {FormData} formData - Form data containing file
   * @param {Object} additionalHeaders - Additional headers to include
   * @returns {Promise<any>} Response data
   * @example
   * ```javascript
   * const formData = new FormData()
   * formData.append('file', file)
   * const result = await apiService.upload('/upload', formData)
   * ```
   */
  async upload(path, formData, additionalHeaders = {}) {
    const url = this.buildUrl(path)
    
    // Remove Content-Type header for FormData (let browser set it with boundary)
    const headers = { ...this.getAuthHeaders() }
    delete headers['Content-Type']
    
    Object.assign(headers, additionalHeaders)

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData
      })

      return await this.handleResponse(response)
    } catch (error) {
      console.error(`UPLOAD ${path} failed:`, error)
      throw error
    }
  }

  /**
   * Get current base URL
   * 
   * @returns {string} Current base URL
   * @example
   * ```javascript
   * const baseUrl = apiService.getBaseUrl()
   * ```
   */
  getBaseUrl() {
    return this.baseUrl
  }

  /**
   * Get current authentication info
   * 
   * @returns {Object|null} Current authentication info
   * @example
   * ```javascript
   * const auth = apiService.getAuthInfo()
   * ```
   */
  getAuthInfo() {
    return this.authInfo
  }

  /**
   * Clear authentication info
   * 
   * @example
   * ```javascript
   * apiService.clearAuthInfo()
   * ```
   */
  clearAuthInfo() {
    this.authInfo = null
  }

  /**
   * Check if authenticated
   * 
   * @returns {boolean} True if has valid authentication
   * @example
   * ```javascript
   * if (apiService.isAuthenticated()) {
   *   // Make authenticated requests
   * }
   * ```
   */
  isAuthenticated() {
    return this.authInfo !== null && this.authInfo !== undefined
  }
}

/**
 * Create a singleton instance of ApiService
 * 
 * @returns {ApiService} Singleton ApiService instance
 * @example
 * ```javascript
 * import { createApiService } from '@uecsio/api-service'
 * 
 * const apiService = createApiService()
 * ```
 */
export function createApiService() {
  return new ApiService()
}

/**
 * Default singleton instance
 * 
 * @example
 * ```javascript
 * import apiService from '@uecsio/api-service'
 * 
 * // Use the default singleton instance
 * apiService.setBaseUrl('http://localhost:3000/api')
 * ```
 */
const apiService = new ApiService()

export default apiService
