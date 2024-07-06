import type { Route } from '#/lib/types'

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

export const threadRoutes: Route[] = [
  { href: '/threads', label: 'Threads', icon: 'mails', match: ['/threads/t/*'] },
  { href: '/threads/send', label: 'Send', icon: 'mail-+' },
]

export const projectRoutes: Route[] = [
  { href: '/projects', label: 'Ongoing', icon: 'folder-heart', match: ['/projects/p/*'] },
  { href: '/projects/create', label: 'Create', icon: 'folder-+' },
  { href: '/projects/search', label: 'Search', icon: 'search' },
  { href: '/projects/archive', label: 'Archive', icon: 'folder-x' },
]


export const authRoutes: Route[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    label: 'Threads',
    href: '/threads',
    subRoutes: threadRoutes
  },
  {
    label: 'Projects',
    href: '/projects',
    subRoutes: projectRoutes
  },
  {
    label: 'Settings',
    href: '/settings',
  },
]