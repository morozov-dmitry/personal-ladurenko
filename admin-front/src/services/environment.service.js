/**
 * Environment Service
 * Manages environment variables and provides configuration for the application
 */

class EnvironmentService {
  constructor() {
    this.config = {
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
      environment: import.meta.env.MODE || 'development',
      isDevelopment: import.meta.env.DEV,
      isProduction: import.meta.env.PROD,
    }
  }

  /**
   * Get API base URL
   * @returns {string} API base URL
   */
  getApiBaseUrl() {
    return this.config.apiBaseUrl
  }

  /**
   * Get current environment
   * @returns {string} Environment name (development, production, etc.)
   */
  getEnvironment() {
    return this.config.environment
  }

  /**
   * Check if running in development mode
   * @returns {boolean} True if in development mode
   */
  isDevelopment() {
    return this.config.isDevelopment
  }

  /**
   * Check if running in production mode
   * @returns {boolean} True if in production mode
   */
  isProduction() {
    return this.config.isProduction
  }

  /**
   * Get all configuration
   * @returns {object} Complete configuration object
   */
  getConfig() {
    return { ...this.config }
  }

  /**
   * Get GridView configuration
   * @returns {object} Configuration object for GridView component
   */
  getGridViewConfig() {
    return {
      apiBaseUrl: this.getApiBaseUrl(),
    }
  }
}

// Create singleton instance
const environmentService = new EnvironmentService()

export default environmentService
