import type { Metadata } from 'next'

import '@/styles/globals.css'

import { Suspense } from 'react'
import localFont from 'next/font/local'

import { APP_DESCRIPTION, APP_NAME } from '@/lib/config'
import { cn } from '@/utils/cn'

import { FullscreenSpinner } from '@/components/global/fullscreen-spinner'
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

const MartianMono = localFont({
  src: '../public/assets/MartianMonoVF.woff2',
  variable: '--font-mono',
})

const UncutSans = localFont({
  src: '../public/assets/UncutSans-Variable.woff2',
  variable: '--font-sans',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={cn(
        'sk-scrollbar h-full overflow-x-hidden font-sans',
        UncutSans.variable,
        MartianMono.variable
      )}
      suppressHydrationWarning>
      <body className="sk-scrollbar flex min-h-full flex-col bg-app-bg tracking-wide text-app-fg selection:bg-highlight selection:text-white">
        <Providers>
          <Suspense fallback={<FullscreenSpinner />}>
            {children}

            <div id="portal" style={{ zIndex: 100 }}>
              <Toaster />
            </div>
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}
