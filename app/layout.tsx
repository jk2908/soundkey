import type { Metadata } from 'next'

import '@/styles/globals.css'

import { Suspense } from 'react'
import localFont from 'next/font/local'
import { GeistSans } from 'geist/font/sans'

import { APP_DESCRIPTION, APP_NAME } from '@/lib/config'
import { cn } from '@/utils/cn'

import { FullscreenLoadingSpinner } from '@/components/global/fullscreen-loading-spinner'
import { Providers } from '@/components/global/providers'
import { Toaster } from '@/components/global/toaster'

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s - ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
}

const MinorPraxis = localFont({
  src: '../public/assets/Minor-Praxis-IngramMono-Regular.woff2',
  variable: '--font-mono',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={cn('h-full font-sans overflow-x-hidden', GeistSans.variable, MinorPraxis.variable)}
      suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-app-bg text-app-fg sk-scrollbar">
        <Providers>
          <Suspense fallback={<FullscreenLoadingSpinner />}>
            {children}

            <div id="portal">
              <Toaster />
            </div>
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}
