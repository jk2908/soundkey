import type { Metadata } from 'next'

import '@/styles/globals.css'

import { GeistSans } from 'geist/font/sans'

import { APP_DESCRIPTION, APP_NAME } from '@/lib/config'
import { cn } from '@/lib/utils'

import { Provider } from '@/components/global/provider'
import { Toaster } from '@/components/global/toaster'

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s - ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={cn('h-full font-sans', GeistSans.variable)} suppressHydrationWarning>
      <body className="bg-app-bg text-app-fg min-h-full">
        <Provider>
          {children}

          <div id="portal">
            <Toaster />
          </div>
        </Provider>
      </body>
    </html>
  )
}
