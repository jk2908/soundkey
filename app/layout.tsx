import type { Metadata } from 'next'

import '@/styles/globals.css'

import { DESCRIPTION, NAME } from '@/lib/config'
import { cn } from '@/lib/utils'

import { Provider } from '@/components/global/provider'

export const metadata: Metadata = {
  title: {
    default: NAME,
    template: `%s - ${NAME}`,
  },
  description: DESCRIPTION,
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      type: 'image/svg+xml',
      url: '/favicon.svg',
    },
    {
      rel: 'apple-touch-icon',
      type: 'image/png',
      sizes: '180x180',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'manifest',
      url: '/site.webmanifest',
    },
    {
      rel: 'android-chrome',
      type: 'image/png',
      sizes: '192x192',
      url: '/android-chrome-192x192.png',
    },
    {
      rel: 'android-chrome',
      type: 'image/png',
      sizes: '512x512',
      url: '/android-chrome-512x512.png',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={cn('h-full')} suppressHydrationWarning>
      <body className="min-h-full">
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
