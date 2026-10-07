import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/context/AppContext'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { ToastContainer } from '@/components/ui/ToastContainer'
import { CommandPalette } from '@/components/search/CommandPalette'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-walsheim',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CollectorEvents — Events for People Who Collect Experiences',
  description:
    'Find the best events, meet like-minded people and collect unforgettable moments. Official discovery hub for die-cast, trading cards, and collector grails.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="bg-pure-canvas text-midnight-ink min-h-screen flex flex-col font-sans antialiased selection:bg-party-pink selection:text-midnight-ink">
        <AppProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileNav />
          <ToastContainer />
          <CommandPalette />
        </AppProvider>
      </body>
    </html>
  )
}
