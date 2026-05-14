import type { Metadata } from 'next'
import { BarChart3 } from 'lucide-react'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata: Metadata = { title: 'Create Account' }

export default function RegisterPage() {
  const hasGoogle = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  const hasGithub = !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-navy-600 flex items-center justify-center mb-3">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-sm text-slate-500 mt-1">
            Free. No credit card. Just a personalized KPI dashboard.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-8">
          <RegisterForm hasGoogle={hasGoogle} hasGithub={hasGithub} />
        </div>
      </div>
    </div>
  )
}
