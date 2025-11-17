# Services

This directory contains application services that provide core functionality across the application.

## Environment Service

The `environment.service.js` provides a centralized way to access environment configuration throughout the application.

### Usage

```javascript
import environmentService from '@/services/environment.service.js'

// Get API base URL
const apiUrl = environmentService.getApiBaseUrl()
// Returns: 'http://localhost:3000/api' (or value from VITE_API_BASE_URL)

// Get current environment
const env = environmentService.getEnvironment()
// Returns: 'development', 'production', etc.

// Check environment
if (environmentService.isDevelopment()) {
  console.log('Running in development mode')
}

// Get all configuration
const config = environmentService.getConfig()
// Returns: { apiBaseUrl: '...', environment: '...', isDevelopment: true, isProduction: false }
```

### Configuration

Environment variables are defined in `.env` file and must be prefixed with `VITE_`:

```bash
# .env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getApiBaseUrl()` | `string` | Returns the base URL for API calls |
| `getEnvironment()` | `string` | Returns current environment name |
| `isDevelopment()` | `boolean` | Returns true if running in development mode |
| `isProduction()` | `boolean` | Returns true if running in production mode |
| `getConfig()` | `object` | Returns complete configuration object |
| `getGridViewConfig()` | `object` | Returns GridView-specific configuration |

### Implementation

The service is implemented as a singleton, so all imports share the same instance:

```javascript
class EnvironmentService {
  constructor() {
    this.config = {
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
      environment: import.meta.env.MODE || 'development',
      isDevelopment: import.meta.env.DEV,
      isProduction: import.meta.env.PROD,
    }
  }
  // ... methods
}

const environmentService = new EnvironmentService()
export default environmentService
```

### Vite Environment Variables

Vite exposes env variables through the special `import.meta.env` object:

- `import.meta.env.MODE` - The mode the app is running in (development, production)
- `import.meta.env.DEV` - Boolean, true in development
- `import.meta.env.PROD` - Boolean, true in production
- `import.meta.env.VITE_*` - Custom variables prefixed with VITE_

See [Vite documentation](https://vitejs.dev/guide/env-and-mode.html) for more information.

