# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-13

### Added
- Initial release of @uecsio/api-service
- Generic API service class with flexible authentication support
- Support for all HTTP methods (GET, POST, PUT, PATCH, DELETE)
- File upload support with FormData
- Automatic error handling and 401 response handling
- TypeScript definitions
- Singleton pattern with default instance
- Comprehensive documentation and examples
- Browser and Node.js compatibility
- No external dependencies

### Features
- **Generic Authentication**: Supports any authentication scheme (JWT, API keys, custom headers)
- **Flexible Configuration**: Easy base URL and authentication setup
- **Error Handling**: Automatic 401 handling and error parsing
- **Lightweight**: Pure JavaScript with no external dependencies
- **TypeScript Support**: Full type definitions included
- **Multiple Usage Patterns**: Singleton instance or custom instances

### API Methods
- `setBaseUrl(url: string)` - Set API base URL
- `applyAuthInfo(auth: AuthInfo)` - Apply authentication headers
- `get(path: string, additionalHeaders?: AdditionalHeaders)` - GET requests
- `post(path: string, data?: RequestData, additionalHeaders?: AdditionalHeaders)` - POST requests
- `patch(path: string, data?: RequestData, additionalHeaders?: AdditionalHeaders)` - PATCH requests
- `put(path: string, data?: RequestData, additionalHeaders?: AdditionalHeaders)` - PUT requests
- `delete(path: string)` - DELETE requests
- `upload(path: string, formData: FormData, additionalHeaders?: AdditionalHeaders)` - File upload
- `getBaseUrl(): string` - Get current base URL
- `getAuthInfo(): AuthInfo | null` - Get current authentication info
- `clearAuthInfo(): void` - Clear authentication info
- `isAuthenticated(): boolean` - Check authentication status

### Utility Functions
- `createApiService(): ApiService` - Create new API service instance
- Default singleton export for immediate use
