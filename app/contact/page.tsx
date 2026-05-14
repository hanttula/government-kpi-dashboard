'use client'

import type { Metadata } from 'next'
import { useState } from 'react'
import { Send, CheckCircle, AlertTriangle, Plus, Database, Bug, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

const requestTypes = [
  {
    value: 'new-kpi',
    label: 'Suggest a New KPI',
    icon: Plus,
    desc: 'Propose a government performance metric not yet in the library.',
  },
  {
    value: 'data-error',
    label: 'Report a Data Error',
    icon: Bug,
    desc: 'Flag an incorrect value, outdated figure, or broken source link.',
  },
  {
    value: 'source-suggestion',
    label: 'Suggest a Data Source',
    icon: Database,
    desc: 'Point us to a public dataset, API, or government report we should use.',
  },
  {
    value: 'general',
    label: 'General Feedback',
    icon: MessageSquare,
    desc: 'Questions, partnership inquiries, or other comments.',
  },
]

export default function ContactPage() {
  const [requestType, setRequestType] = useState<string>('new-kpi')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [org, setOrg] = useState('')
  const [branch, setBranch] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in the required fields.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestType, name, email, org, branch, message }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      setSubmitted(true)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-civic-green" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Thank You</h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          Your submission has been received. We review all requests and prioritize based on data
          availability and public interest. We may not be able to reply individually, but all
          feedback informs our roadmap.
        </p>
        <button
          onClick={() => {
            setSubmitted(false)
            setName(''); setEmail(''); setOrg(''); setBranch(''); setMessage('')
          }}
          className="btn-secondary"
        >
          Submit Another Request
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Community
        </p>
        <h1 className="text-3xl font-bold text-navy-600 mb-3">Request / Contact</h1>
        <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
          Help us improve the dashboard by suggesting KPIs, reporting data errors, or pointing us
          to useful public data sources.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Request type */}
        <fieldset>
          <legend className="text-sm font-semibold text-slate-700 mb-3">
            What would you like to do? <span className="text-red-500">*</span>
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {requestTypes.map(({ value, label, icon: Icon, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRequestType(value)}
                className={cn(
                  'text-left rounded-xl border p-4 transition',
                  requestType === value
                    ? 'border-navy-600 bg-navy-50 ring-1 ring-navy-600'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon
                    className={cn(
                      'w-4 h-4',
                      requestType === value ? 'text-navy-600' : 'text-slate-400'
                    )}
                  />
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      requestType === value ? 'text-navy-600' : 'text-slate-700'
                    )}
                  >
                    {label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 ml-6">{desc}</p>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Name and email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-civic"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-civic"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Organization and branch */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Organization <span className="text-slate-400 text-xs">(optional)</span>
            </label>
            <input
              type="text"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              className="input-civic"
              placeholder="Agency, university, or org"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Relevant Branch <span className="text-slate-400 text-xs">(optional)</span>
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="input-civic"
            >
              <option value="">Any / Not specific</option>
              <option value="executive">Executive Branch</option>
              <option value="legislative">Legislative Branch</option>
              <option value="judicial">Judicial Branch</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {requestType === 'new-kpi'
              ? 'Describe the KPI you want added'
              : requestType === 'data-error'
              ? 'Describe the error and correct value/source'
              : requestType === 'source-suggestion'
              ? 'Describe the data source (include URL if possible)'
              : 'Your message'}{' '}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="input-civic resize-y"
            placeholder={
              requestType === 'new-kpi'
                ? 'What should be measured, why it matters, and what public data source exists...'
                : requestType === 'data-error'
                ? 'Which KPI, what the error is, and a link to the correct source...'
                : requestType === 'source-suggestion'
                ? 'Name of the source, URL, what it covers, and which KPI it could support...'
                : 'Your question or feedback...'
            }
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-400">
            We review all submissions. No account required.
          </p>
          <button type="submit" className="btn-primary" disabled={loading}>
            <Send className="w-4 h-4" />
            {loading ? 'Submitting…' : 'Submit Request'}
          </button>
        </div>
      </form>

      {/* Note about data integrity */}
      <div className="mt-10 rounded-xl bg-blue-50 border border-blue-100 p-5">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          Commitment to Data Integrity
        </h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          We prioritize reports of data errors over new feature requests. If you find an incorrect
          figure, an outdated source, or a broken link, please tell us — accurate data is the
          foundation of everything on this site. We aim to correct errors within 48 hours of
          verification.
        </p>
      </div>
    </div>
  )
}
