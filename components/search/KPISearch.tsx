'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { KPI, Branch, RefreshFrequency } from '@/lib/types'
import { KPICard } from '@/components/kpi/KPICard'

interface KPISearchProps {
  kpis: KPI[]
  defaultBranch?: Branch
}

const branchOptions: { value: Branch | 'all'; label: string }[] = [
  { value: 'all', label: 'All Branches' },
  { value: 'executive', label: 'Executive' },
  { value: 'legislative', label: 'Legislative' },
  { value: 'judicial', label: 'Judicial' },
]

const frequencyOptions: { value: RefreshFrequency | 'all'; label: string }[] = [
  { value: 'all', label: 'Any frequency' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annual', label: 'Annual' },
]

const categoryOptions = [
  'All Categories',
  'Fiscal Management',
  'Macroeconomic Performance',
  'Agency Operations',
  'Emergency Management',
  'Regulatory Activity',
  'Border & Immigration',
  'Public Confidence',
  'Legislative Output',
  'Fiscal Responsibility',
  'Oversight Activity',
  'Legislative Process',
  'Constituent Service',
  'Member Performance',
  'Transparency & Ethics',
  'Court Capacity',
  'Court Efficiency',
  'Judicial Quality',
  'Criminal Justice',
  'Access to Justice',
]

export function KPISearch({ kpis, defaultBranch }: KPISearchProps) {
  const [query, setQuery] = useState('')
  const [branch, setBranch] = useState<Branch | 'all'>(defaultBranch ?? 'all')
  const [category, setCategory] = useState('All Categories')
  const [frequency, setFrequency] = useState<RefreshFrequency | 'all'>('all')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return kpis.filter((k) => {
      if (branch !== 'all' && k.branch !== branch) return false
      if (category !== 'All Categories' && k.category !== category) return false
      if (frequency !== 'all' && k.refreshFrequency !== frequency) return false
      if (!q) return true
      return (
        k.name.toLowerCase().includes(q) ||
        k.tagline.toLowerCase().includes(q) ||
        k.category.toLowerCase().includes(q) ||
        k.tags.some((t) => t.toLowerCase().includes(q))
      )
    })
  }, [kpis, query, branch, category, frequency])

  const hasFilters = branch !== 'all' || category !== 'All Categories' || frequency !== 'all'

  return (
    <div>
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search KPIs by name, category, or tag..."
            className="input-civic pl-10"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition',
            showFilters || hasFilters
              ? 'border-navy-600 bg-navy-50 text-navy-600'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasFilters && (
            <span className="w-5 h-5 rounded-full bg-navy-600 text-white text-[10px] flex items-center justify-center">
              {[branch !== 'all', category !== 'All Categories', frequency !== 'all'].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mt-3 p-4 rounded-xl bg-white border border-slate-100 shadow-card grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Branch
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value as Branch | 'all')}
              className="input-civic"
            >
              {branchOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-civic"
            >
              {categoryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Update Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as RefreshFrequency | 'all')}
              className="input-civic"
            >
              {frequencyOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          {hasFilters && (
            <div className="sm:col-span-3 flex justify-end">
              <button
                onClick={() => { setBranch('all'); setCategory('All Categories'); setFrequency('all') }}
                className="text-xs text-slate-500 hover:text-navy-600 flex items-center gap-1 transition"
              >
                <X className="w-3.5 h-3.5" />
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{filtered.length}</span>{' '}
            of {kpis.length} KPIs
            {query && (
              <> matching <span className="font-semibold text-navy-600">&ldquo;{query}&rdquo;</span></>
            )}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-medium">No KPIs found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((kpi) => (
              <KPICard key={kpi.id} kpi={kpi} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
