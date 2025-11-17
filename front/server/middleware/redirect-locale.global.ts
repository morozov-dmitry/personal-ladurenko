export default defineEventHandler((event) => {
  // Only handle GET requests to the root path
  if (event.node.req.method !== 'GET') {
    return
  }

  const url = getRequestURL(event)
  
  // If accessing the root path without locale prefix
  if (url.pathname === '/' || url.pathname === '') {
    // Get the preferred locale from Accept-Language header
    const acceptLanguage = getHeader(event, 'accept-language') || ''
    const defaultLocale = 'uk' // Your default locale from nuxt.config.ts
    
    // Simple language detection based on Accept-Language header
    let preferredLocale = defaultLocale
    if (acceptLanguage.includes('ru')) {
      preferredLocale = 'ru'
    } else if (acceptLanguage.includes('uk') || acceptLanguage.includes('ua')) {
      preferredLocale = 'uk'
    }
    
    // Redirect to the locale-prefixed URL
    const redirectUrl = `/${preferredLocale}${url.search}`
    
    // Send 302 redirect
    setHeader(event, 'location', redirectUrl)
    setResponseStatus(event, 302)
    return
  }
})
