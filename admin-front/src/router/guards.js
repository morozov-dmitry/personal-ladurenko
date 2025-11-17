/**
 * Route Guards
 * 
 * Navigation guards for protecting routes and handling authentication.
 * Redirects unauthenticated users to login page and prevents access
 * to protected routes without valid authentication.
 * 
 * @module routeGuards
 * @example
 * ```javascript
 * import { authGuard, guestGuard } from '@/router/guards'
 * 
 * // Use in router configuration
 * router.beforeEach(authGuard)
 * ```
 */
import { useAuthStore } from '@/stores/auth'

/**
 * Authentication Guard
 * 
 * Protects routes that require authentication. Redirects to login
 * if user is not authenticated or token is expired.
 * 
 * @param {Object} to - Target route
 * @param {Object} from - Source route
 * @param {Function} next - Navigation function
 * @example
 * ```javascript
 * // Protect a route
 * router.beforeEach(authGuard)
 * ```
 */
export const authGuard = (to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if user is authenticated
  if (authStore.isAuthenticated && authStore.checkAuth()) {
    // User is authenticated, allow access
    next()
  } else {
    // User is not authenticated, redirect to login
    console.log('User not authenticated, redirecting to login')
    next({
      path: '/pages/login',
      query: { redirect: to.fullPath }
    })
  }
}

/**
 * Guest Guard
 * 
 * Prevents authenticated users from accessing guest-only routes
 * like login page. Redirects to dashboard if user is already logged in.
 * 
 * @param {Object} to - Target route
 * @param {Object} from - Source route
 * @param {Function} next - Navigation function
 * @example
 * ```javascript
 * // Prevent authenticated users from accessing login
 * router.beforeEach(guestGuard)
 * ```
 */
export const guestGuard = (to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if user is authenticated
  if (authStore.isAuthenticated && authStore.checkAuth()) {
    // User is already authenticated, redirect to dashboard
    console.log('User already authenticated, redirecting to dashboard')
    next('/dashboard')
  } else {
    // User is not authenticated, allow access to guest routes
    next()
  }
}

/**
 * Admin Guard
 * 
 * Protects routes that require admin privileges. Checks user status
 * and redirects if user doesn't have admin access.
 * 
 * @param {Object} to - Target route
 * @param {Object} from - Source route
 * @param {Function} next - Navigation function
 * @example
 * ```javascript
 * // Protect admin routes
 * router.beforeEach(adminGuard)
 * ```
 */
export const adminGuard = (to, from, next) => {
  const authStore = useAuthStore()
  
  // First check if user is authenticated
  if (!authStore.isAuthenticated || !authStore.checkAuth()) {
    next({
      path: '/pages/login',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  // Check if user has admin status (status === 1 for active admin)
  if (authStore.hasStatus(1)) {
    // User has admin access, allow navigation
    next()
  } else {
    // User doesn't have admin access, redirect to dashboard
    console.log('User does not have admin access')
    next('/dashboard')
  }
}

/**
 * Conditional Guard
 * 
 * Applies different guards based on route meta requirements.
 * 
 * @param {Object} to - Target route
 * @param {Object} from - Source route
 * @param {Function} next - Navigation function
 * @example
 * ```javascript
 * // Use conditional guard for flexible protection
 * router.beforeEach(conditionalGuard)
 * ```
 */
export const conditionalGuard = (to, from, next) => {
  const authStore = useAuthStore()
  
  // Check route meta requirements
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  
  // Handle guest-only routes
  if (requiresGuest) {
    if (authStore.isAuthenticated && authStore.checkAuth()) {
      next('/dashboard')
      return
    }
    next()
    return
  }
  
  // Handle protected routes
  if (requiresAuth) {
    if (!authStore.isAuthenticated || !authStore.checkAuth()) {
      next({
        path: '/pages/login',
        query: { redirect: to.fullPath }
      })
      return
    }
    
    // Check admin requirements
    if (requiresAdmin && !authStore.hasStatus(1)) {
      next('/dashboard')
      return
    }
  }
  
  // Allow navigation
  next()
}
