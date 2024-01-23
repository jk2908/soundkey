import type { Route } from '@/lib/types'

export const unauthRoutes: Route[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Login',
    href: '/login',
  },
  {
    label: 'Signup',
    href: '/signup',
  },
]

export const authRoutes: Route[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    label: 'Messages',
    href: '/messages',
  },
  {
    label: 'Profile',
    href: '/profile',
  },
  {
    label: 'Settings',
    href: '/settings',
  },
]

export const protectedRoutes: Route[] = [
  {
    label: 'Admin',
    href: '/admin',
  },
]
