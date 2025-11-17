/**
 * @uecsio/api-service Usage Examples
 * 
 * This file demonstrates various ways to use the API service package.
 */

// Example 1: Using the default singleton instance
import apiService from '@uecsio/api-service'

// Example 2: Creating a custom instance
import { ApiService, createApiService } from '@uecsio/api-service'

// Example 3: TypeScript usage
// import { ApiService, AuthInfo, AdditionalHeaders } from '@uecsio/api-service'

// Basic setup with default instance
apiService.setBaseUrl('http://localhost:3000/api')

// JWT Bearer token authentication
apiService.applyAuthInfo({
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
})

// Make authenticated requests
async function exampleUsage() {
  try {
    // GET request
    const users = await apiService.get('/users')
    console.log('Users:', users)

    // POST request
    const newUser = await apiService.post('/users', {
      name: 'John Doe',
      email: 'john@example.com'
    })
    console.log('Created user:', newUser)

    // PATCH request
    const updatedUser = await apiService.patch('/users/123', {
      name: 'John Updated'
    })
    console.log('Updated user:', updatedUser)

    // DELETE request
    await apiService.delete('/users/123')
    console.log('User deleted')

    // File upload
    const formData = new FormData()
    formData.append('file', file)
    const uploadResult = await apiService.upload('/upload', formData)
    console.log('Upload result:', uploadResult)

  } catch (error) {
    console.error('API Error:', error.message)
  }
}

// Custom instance example
const customApiService = new ApiService()
customApiService.setBaseUrl('https://api.example.com')
customApiService.applyAuthInfo({
  'X-API-Key': 'your-api-key-here'
})

// Factory function example
const factoryApiService = createApiService()
factoryApiService.setBaseUrl('https://another-api.com')
factoryApiService.applyAuthInfo({
  'Authorization': 'Custom your-custom-token',
  'X-Client-ID': 'client-123'
})

// Authentication schemes examples
const authExamples = {
  // JWT Bearer token
  jwt: {
    'Authorization': 'Bearer jwt-token-here'
  },
  
  // API Key
  apiKey: {
    'X-API-Key': 'api-key-here'
  },
  
  // Custom authentication
  custom: {
    'Authorization': 'Custom custom-token',
    'X-User-ID': '123',
    'X-Role': 'admin'
  },
  
  // Multiple headers
  multiple: {
    'Authorization': 'Bearer token',
    'X-API-Version': 'v2',
    'X-Client-ID': 'client-123'
  }
}

// Apply different authentication schemes
Object.entries(authExamples).forEach(([name, auth]) => {
  console.log(`Applying ${name} authentication:`, auth)
  // apiService.applyAuthInfo(auth)
})

export { exampleUsage, customApiService, factoryApiService }
