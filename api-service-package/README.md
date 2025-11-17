# @uecsio/api-service

A generic, flexible API service for making authenticated HTTP requests with automatic error handling and response parsing.

## ✨ Features

- 🚀 **Generic Authentication** - Supports any authentication scheme (JWT, API keys, custom headers)
- 📡 **HTTP Methods** - GET, POST, PUT, PATCH, DELETE, and file upload support
- 🔧 **Flexible Configuration** - Easy base URL and authentication setup
- 🛡️ **Error Handling** - Automatic 401 handling and error parsing
- 📦 **Lightweight** - No external dependencies, pure JavaScript
- 🎯 **TypeScript Support** - Full type definitions included
- 🔄 **Singleton Pattern** - Default instance or create your own

## 📦 Installation

```bash
npm install @uecsio/api-service
```

## 🚀 Quick Start

### Basic Usage

```javascript
import apiService from '@uecsio/api-service'

// Set base URL
apiService.setBaseUrl('http://localhost:3000/api')

// Apply authentication
apiService.applyAuthInfo({
  'Authorization': 'Bearer your-jwt-token'
})

// Make requests
const users = await apiService.get('/users')
const newUser = await apiService.post('/users', { name: 'John', email: 'john@example.com' })
```

### Using Custom Instance

```javascript
import { ApiService } from '@uecsio/api-service'

const apiService = new ApiService()
apiService.setBaseUrl('https://api.example.com')
apiService.applyAuthInfo({
  'X-API-Key': 'your-api-key'
})
```

## 📚 API Reference

### Configuration

#### `setBaseUrl(url: string)`
Set the base URL for all API requests.

```javascript
apiService.setBaseUrl('http://localhost:3000/api')
```

#### `applyAuthInfo(auth: AuthInfo)`
Apply authentication information. Accepts any object with header key-value pairs.

```javascript
// JWT Bearer token
apiService.applyAuthInfo({
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
})

// API Key
apiService.applyAuthInfo({
  'X-API-Key': 'your-api-key-here'
})

// Custom authentication
apiService.applyAuthInfo({
  'Authorization': 'Custom your-custom-token',
  'X-User-ID': '123',
  'X-Role': 'admin'
})
```

### HTTP Methods

#### `get(path: string, additionalHeaders?: AdditionalHeaders): Promise<any>`
Make a GET request.

```javascript
const users = await apiService.get('/users')
const user = await apiService.get('/users/123', { 'X-Custom': 'value' })
```

#### `post(path: string, data?: RequestData, additionalHeaders?: AdditionalHeaders): Promise<any>`
Make a POST request.

```javascript
const user = await apiService.post('/users', { name: 'John', email: 'john@example.com' })
```

#### `patch(path: string, data?: RequestData, additionalHeaders?: AdditionalHeaders): Promise<any>`
Make a PATCH request.

```javascript
const user = await apiService.patch('/users/123', { name: 'John Updated' })
```

#### `put(path: string, data?: RequestData, additionalHeaders?: AdditionalHeaders): Promise<any>`
Make a PUT request.

```javascript
const user = await apiService.put('/users/123', userData)
```

#### `delete(path: string): Promise<any>`
Make a DELETE request.

```javascript
await apiService.delete('/users/123')
```

#### `upload(path: string, formData: FormData, additionalHeaders?: AdditionalHeaders): Promise<any>`
Upload file with FormData.

```javascript
const formData = new FormData()
formData.append('file', file)
const result = await apiService.upload('/upload', formData)
```

### Utility Methods

#### `getBaseUrl(): string`
Get current base URL.

```javascript
const baseUrl = apiService.getBaseUrl()
```

#### `getAuthInfo(): AuthInfo | null`
Get current authentication info.

```javascript
const auth = apiService.getAuthInfo()
```

#### `clearAuthInfo(): void`
Clear authentication info.

```javascript
apiService.clearAuthInfo()
```

#### `isAuthenticated(): boolean`
Check if authenticated.

```javascript
if (apiService.isAuthenticated()) {
  // Make authenticated requests
}
```

## 🔧 Advanced Usage

### Multiple Authentication Schemes

```javascript
// Switch between different auth schemes
apiService.applyAuthInfo({
  'Authorization': 'Bearer jwt-token',
  'X-API-Version': 'v2'
})

// Or use API key
apiService.applyAuthInfo({
  'X-API-Key': 'your-api-key',
  'X-Client-ID': 'client-123'
})
```

### Custom Error Handling

```javascript
try {
  const data = await apiService.get('/protected-endpoint')
} catch (error) {
  if (error.message === 'Authentication required') {
    // Handle 401 - redirect to login
    window.location.href = '/login'
  } else {
    // Handle other errors
    console.error('API Error:', error.message)
  }
}
```

### File Upload with Progress

```javascript
const formData = new FormData()
formData.append('file', file)
formData.append('description', 'File description')

const result = await apiService.upload('/upload', formData, {
  'X-Upload-Type': 'image'
})
```

## 🎯 TypeScript Support

The package includes full TypeScript definitions:

```typescript
import { ApiService, AuthInfo, AdditionalHeaders } from '@uecsio/api-service'

const apiService = new ApiService()

// Type-safe authentication
const auth: AuthInfo = {
  'Authorization': 'Bearer token',
  'X-User-ID': '123'
}

apiService.applyAuthInfo(auth)

// Type-safe requests
const users: User[] = await apiService.get('/users')
const newUser: User = await apiService.post('/users', userData)
```

## 🔄 Integration Examples

### Vue.js Integration

```javascript
// services/api.js
import apiService from '@uecsio/api-service'

// Configure in main.js or app initialization
apiService.setBaseUrl(import.meta.env.VITE_API_BASE_URL)

export default apiService
```

### React Integration

```javascript
// services/api.js
import { createApiService } from '@uecsio/api-service'

const apiService = createApiService()
apiService.setBaseUrl(process.env.REACT_APP_API_BASE_URL)

export default apiService
```

### Node.js Integration

```javascript
// Note: Requires fetch polyfill for Node.js < 18
import fetch from 'node-fetch'
global.fetch = fetch

import apiService from '@uecsio/api-service'

apiService.setBaseUrl('https://api.example.com')
apiService.applyAuthInfo({
  'X-API-Key': process.env.API_KEY
})
```

## 📋 Error Handling

The service automatically handles common HTTP errors:

- **401 Unauthorized**: Automatically clears authentication info
- **Other HTTP errors**: Parses error messages from response body
- **Network errors**: Passes through to caller for handling

## 🔧 Browser Compatibility

- Modern browsers with fetch API support
- No polyfills required for modern environments
- TypeScript support for all modern environments

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our [GitHub repository](https://github.com/uecsio/api-service).

## 📞 Support

For support and questions:
- Create an issue on [GitHub](https://github.com/uecsio/api-service/issues)
- Check the [documentation](https://github.com/uecsio/api-service#readme)

---

Made with ❤️ by the UECSIO Development Team
