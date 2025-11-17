import { h, resolveComponent } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { conditionalGuard } from './guards'

import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DefaultLayout,
    redirect: '/dashboard',
    meta: { requiresAuth: true }, // Protect all main routes
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '@/views/dashboard/Dashboard.vue'
          ),
        meta: { requiresAuth: true },
      },
      {
        path: '/orders',
        name: 'Orders',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/orders/list',
        meta: { requiresAuth: true },
        children: [
          {
            path: '/orders/list',
            name: 'Orders List',
            component: () => import('@/views/orders/OrdersList.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/orders/add',
            name: 'Add Order',
            component: () => import('@/views/orders/AddOrder.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: '/orders/update/:id',
            name: 'Update Order',
            component: () => import('@/views/orders/UpdateOrder.vue'),
            meta: { requiresAuth: true },
          },
        ],
      },
    ],
  },
  {
    path: '/pages',
    redirect: '/pages/404',
    name: 'Pages',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: '404',
        name: 'Page404',
        component: () => import('@/views/pages/Page404'),
        meta: { requiresGuest: true }, // Allow access without auth
      },
      {
        path: '500',
        name: 'Page500',
        component: () => import('@/views/pages/Page500'),
        meta: { requiresGuest: true }, // Allow access without auth
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/pages/Login'),
        meta: { requiresGuest: true }, // Prevent authenticated users from accessing
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

// Apply route guards
router.beforeEach(conditionalGuard)

export default router
