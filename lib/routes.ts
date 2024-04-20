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
    label: 'Threads',
    href: '/threads',
  },
  {
    label: 'Projects',
    href: '/projects',
  },
  {
    label: 'Settings',
    href: '/settings',
  },
]