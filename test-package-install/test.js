// Test the published package
import { ApiService } from '@uecsio/api-service'

console.log('✅ Package imported successfully!')

const apiService = new ApiService()
apiService.setBaseUrl('https://api.example.com')
apiService.applyAuthInfo({
  'Authorization': 'Bearer test-token'
})

console.log('✅ API service configured successfully!')
console.log('✅ Base URL:', apiService.getBaseUrl())
console.log('✅ Is authenticated:', apiService.isAuthenticated())
console.log('🎉 Package works perfectly!')

