import type { Metadata } from 'next'
import { BarChart3 } from 'lucide-react'
import { SignInForm } from '@/components/auth/SignInForm'

export const metadata: Metadata = { title: 'Sign In' }

interface Props {
  searchParams: { callbackUrl?: string; error?: string }
}

export default function SignInPage({ searchParams }: Props) {
  // Check which OAuth providers are actually configured — server-side only
  const hasGoogle = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  const hasGithub = !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)

  const callbackUrl = searchParams.callbackUrl ?? '/dashboard'
  const urlError = searchParams.error

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-navy-600 flex items-center justify-center mb-3">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Sign in to your dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Track the government KPIs that matter to you.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-8">
          <SignInForm
            callbackUrl={callbackUrl}
            hasGoogle={hasGoogle}
            hasGithub={hasGithub}
            urlError={urlError}
          />
        </div>
      </div>
    </div>
  )
}
