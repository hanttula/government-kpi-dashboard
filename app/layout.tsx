import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SessionProviderWrapper } from '@/components/auth/SessionProviderWrapper'

export const metadata: Metadata = {
  title: {
    default: 'Government KPI Dashboard — Civic Transparency by Branch',
    template: '%s | Gov KPI Dashboard',
  },
  description:
    'Objective, nonpartisan performance metrics for the Executive, Legislative, and Judicial branches of the U.S. federal government. Track outcomes, efficiency, and accountability.',
  keywords: [
    'government performance',
    'civic transparency',
    'federal KPIs',
    'accountability dashboard',
    'Congress metrics',
    'federal courts',
    'executive branch',
    'nonpartisan',
    'public data',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Government KPI Dashboard',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <SessionProviderWrapper>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
