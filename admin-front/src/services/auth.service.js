/**
 * Authentication Service
 * 
 * Handles authentication operations including login, logout, token management,
 * and API request authentication. Integrates with the backend auth API.
 * 
 * @class AuthService
 * @example
 * ```javascript
 * import authService from '@/services/auth.service'
 * 
 * // Login
 * const result = await authService.login('username', 'password')
 * 
 * // Check if user is authenticated
 * if (authService.isAuthenticated()) {
 *   // User is logged in
 * }
 * ```
 */
import environmentService from './environment.service'

class AuthService {
  constructor() {
    this.tokenKey = 'access_token'
    this.userKey = 'user_data'
    this.apiBaseUrl = environmentService.getApiBaseUrl()
  }

  /**
   * Login user with username and password
   * 
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<Object>} Login response with token and user data
   * @throws {Error} If login fails
   * @example
   * ```javascript
   * try {
   *   const result = await authService.login('john_doe', 'password123')
   *   console.log('Login successful:', result.user.username)
   * } catch (error) {
   *   console.error('Login failed:', error.message)
   * }
   * ```
   */
  async login(username, password) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const data = await response.json()
      
      // Store token and user data
      this.setToken(data.access_token)
      this.setUser(data.user)
      
      return data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  /**
   * Register new user
   * 
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration response with token and user data
   * @throws {Error} If registration fails
   * @example
   * ```javascript
   * const userData = {
   *   username: 'john_doe',
   *   password: 'password123',
   *   name: 'John Doe',
   *   town: 'Kyiv',
   *   address: '123 Main Street',
   *   phone: '+380961234567'
   * }
   * 
   * const result = await authService.register(userData)
   * ```
   */
  async register(userData) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Registration failed')
      }

      const data = await response.json()
      
      // Store token and user data
      this.setToken(data.access_token)
      this.setUser(data.user)
      
      return data
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  /**
   * Logout user and clear stored data
   * 
   * @example
   * ```javascript
   * authService.logout()
   * // User is now logged out and token is cleared
   * ```
   */
  logout() {
    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.userKey)
  }

  /**
   * Get stored authentication token
   * 
   * @returns {string|null} JWT token or null if not found
   * @example
   * ```javascript
   * const token = authService.getToken()
   * if (token) {
   *   // Token exists
   * }
   * ```
   */
  getToken() {
    return localStorage.getItem(this.tokenKey)
  }

  /**
   * Set authentication token
   * 
   * @param {string} token - JWT token to store
   * @example
   * ```javascript
   * authService.setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
   * ```
   */
  setToken(token) {
    localStorage.setItem(this.tokenKey, token)
  }

  /**
   * Get stored user data
   * 
   * @returns {Object|null} User data or null if not found
   * @example
   * ```javascript
   * const user = authService.getUser()
   * if (user) {
   *   console.log('Current user:', user.username)
   * }
   * ```
   */
  getUser() {
    const userData = localStorage.getItem(this.userKey)
    return userData ? JSON.parse(userData) : null
  }

  /**
   * Set user data
   * 
   * @param {Object} user - User data to store
   * @example
   * ```javascript
   * authService.setUser({
   *   id: '123',
   *   username: 'john_doe',
   *   name: 'John Doe'
   * })
   * ```
   */
  setUser(user) {
    localStorage.setItem(this.userKey, JSON.stringify(user))
  }

  /**
   * Check if user is authenticated
   * 
   * @returns {boolean} True if user has valid token
   * @example
   * ```javascript
   * if (authService.isAuthenticated()) {
   *   // User is logged in
   * } else {
   *   // Redirect to login
   * }
   * ```
   */
  isAuthenticated() {
    const token = this.getToken()
    if (!token) return false

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      return payload.exp > currentTime
    } catch (error) {
      console.error('Token validation error:', error)
      return false
    }
  }

  /**
   * Get authorization header for API requests
   * 
   * @returns {Object} Headers object with Authorization header
   * @example
   * ```javascript
   * const headers = authService.getAuthHeaders()
   * fetch('/api/protected', { headers })
   * ```
   */
  getAuthHeaders() {
    const token = this.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  /**
   * Make authenticated API request
   * 
   * @param {string} url - API endpoint URL
   * @param {Object} options - Fetch options
   * @returns {Promise<Response>} Fetch response
   * @example
   * ```javascript
   * const response = await authService.authenticatedRequest('/api/profile')
   * ```
   */
  async authenticatedRequest(url, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...options.headers,
    }

    return fetch(url, {
      ...options,
      headers,
    })
  }

  /**
   * Get user profile from API
   * 
   * @returns {Promise<Object>} User profile data
   * @throws {Error} If request fails
   * @example
   * ```javascript
   * const profile = await authService.getProfile()
   * console.log('User profile:', profile)
   * ```
   */
  async getProfile() {
    try {
      const response = await this.authenticatedRequest(`${this.apiBaseUrl}/auth/profile`)
      
      if (!response.ok) {
        throw new Error('Failed to get profile')
      }

      return await response.json()
    } catch (error) {
      console.error('Get profile error:', error)
      throw error
    }
  }
}

// Create singleton instance
const authService = new AuthService()

export default authService
