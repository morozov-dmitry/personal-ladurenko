/**
 * Authentication Store
 * 
 * Pinia store for managing authentication state across the application.
 * Provides reactive state management for user authentication status,
 * user data, and authentication actions.
 * 
 * @store useAuthStore
 * @example
 * ```javascript
 * import { useAuthStore } from '@/stores/auth'
 * 
 * const authStore = useAuthStore()
 * 
 * // Login
 * await authStore.login('username', 'password')
 * 
 * // Check authentication status
 * if (authStore.isAuthenticated) {
 *   // User is logged in
 * }
 * ```
 */
import { defineStore } from 'pinia'
import authService from '@/services/auth.service'
import apiConfigService from '@/services/apiConfig.service'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // User authentication status
    isAuthenticated: false,
    
    // Current user data
    user: null,
    
    // Loading states
    isLoading: false,
    loginError: null,
    registerError: null,
  }),

  getters: {
    /**
     * Get current user's username
     * @returns {string|null} Username or null if not logged in
     */
    username: (state) => state.user?.username || null,

    /**
     * Get current user's display name
     * @returns {string|null} Display name or null if not logged in
     */
    displayName: (state) => state.user?.name || state.user?.username || null,

    /**
     * Check if user has specific role or status
     * @returns {Function} Function that takes status and returns boolean
     */
    hasStatus: (state) => (status) => state.user?.status === status,

    /**
     * Get user's full profile data
     * @returns {Object|null} Complete user data or null
     */
    userProfile: (state) => state.user,
  },

  actions: {
    /**
     * Initialize authentication state from stored data
     * 
     * Called on app startup to restore authentication state
     * from localStorage.
     * 
     * @example
     * ```javascript
     * // Call this in main.js or app initialization
     * authStore.initializeAuth()
     * ```
     */
    initializeAuth() {
      const token = authService.getToken()
      const user = authService.getUser()
      
      if (token && user && authService.isAuthenticated()) {
        this.isAuthenticated = true
        this.user = user
      } else {
        // Clear invalid data
        authService.logout()
        this.isAuthenticated = false
        this.user = null
      }
    },

    /**
     * Login user with username and password
     * 
     * @param {string} username - User's username
     * @param {string} password - User's password
     * @returns {Promise<Object>} Login response data
     * @throws {Error} If login fails
     * @example
     * ```javascript
     * try {
     *   const result = await authStore.login('john_doe', 'password123')
     *   console.log('Login successful')
     * } catch (error) {
     *   console.error('Login failed:', error.message)
     * }
     * ```
     */
    async login(username, password) {
      this.isLoading = true
      this.loginError = null

      try {
        const result = await authService.login(username, password)
        
        this.isAuthenticated = true
        this.user = result.user
        
        // Apply authentication to API service
        apiConfigService.applyCurrentAuth()
        
        return result
      } catch (error) {
        this.loginError = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Register new user
     * 
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} Registration response data
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
     * await authStore.register(userData)
     * ```
     */
    async register(userData) {
      this.isLoading = true
      this.registerError = null

      try {
        const result = await authService.register(userData)
        
        this.isAuthenticated = true
        this.user = result.user
        
        // Apply authentication to API service
        apiConfigService.applyCurrentAuth()
        
        return result
      } catch (error) {
        this.registerError = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Logout user and clear all state
     * 
     * @example
     * ```javascript
     * authStore.logout()
     * // User is now logged out
     * ```
     */
    logout() {
      authService.logout()
      this.isAuthenticated = false
      this.user = null
      this.loginError = null
      this.registerError = null
      
      // Clear authentication from API service
      apiConfigService.clearAuth()
    },

    /**
     * Refresh user profile data from API
     * 
     * @returns {Promise<Object>} Updated user profile
     * @throws {Error} If request fails
     * @example
     * ```javascript
     * const updatedProfile = await authStore.refreshProfile()
     * ```
     */
    async refreshProfile() {
      try {
        const profile = await authService.getProfile()
        this.user = profile
        authService.setUser(profile)
        return profile
      } catch (error) {
        console.error('Failed to refresh profile:', error)
        // If profile refresh fails, user might be logged out
        this.logout()
        throw error
      }
    },

    /**
     * Clear authentication errors
     * 
     * @example
     * ```javascript
     * authStore.clearErrors()
     * ```
     */
    clearErrors() {
      this.loginError = null
      this.registerError = null
    },

    /**
     * Check if user is authenticated and token is valid
     * 
     * @returns {boolean} True if user is authenticated
     * @example
     * ```javascript
     * if (authStore.checkAuth()) {
     *   // User is authenticated
     * }
     * ```
     */
    checkAuth() {
      const isValid = authService.isAuthenticated()
      
      if (!isValid && this.isAuthenticated) {
        // Token expired, logout user
        this.logout()
      }
      
      return isValid
    },
  },
})
