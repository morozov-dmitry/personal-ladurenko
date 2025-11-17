/**
 * API Service
 * 
 * Centralized API client using @uecsio/api-client for making authenticated requests.
 * This provides a singleton instance of ApiClient configured for the application.
 * 
 * @module api
 * @example
 * ```javascript
 * import { apiClient } from '@/services/api'
 * // or
 * import { APIService } from '@/services/api' // Same instance, for backwards compatibility
 * 
 * // Make API requests
 * const users = await apiClient.get('/users')
 * const newUser = await apiClient.post('/users', { name: 'John' })
 * const updated = await apiClient.patch('/users/123', { name: 'Jane' })
 * await apiClient.delete('/users/123')
 * 
 * // Utility methods
 * const url = apiClient.getRestfulEntityUrl('/users', { id: 123 })
 * const isAuth = apiClient.isAuthenticated()
 * ```
 */
import { ApiClient } from '@uecsio/api-client'
import environmentService from './environment.service'

/**
 * Create and export the API client instance
 * Will be initialized with proper configuration in apiConfig.service.js
 */
export const apiClient = new ApiClient({
  baseUrl: environmentService.getApiBaseUrl(),
  getToken: () => {
    // Get token from localStorage (will be set up by auth service)
    return localStorage.getItem('token')
  },
  saveToken: (token) => {
    // Save token to localStorage
    localStorage.setItem('token', token)
  },
  clearToken: () => {
    // Clear token from localStorage
    localStorage.removeItem('token')
  },
  onUnauthorized: () => {
    // Handle 401 responses
    console.warn('Unauthorized: Token may be expired or invalid')
    // The auth store will handle the redirect to login
  },
})

// Export as APIService for backwards compatibility
export const APIService = apiClient

// Default export
export default apiClient

