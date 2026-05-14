'use client'

import { useState, useEffect } from 'react'
import { X, Check, Search, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn, formatValue, branchConfig } from '@/lib/utils'
import type { KPI, Branch } from '@/lib/types'

interface KPISelectorProps {
  branch: Branch
  kpis: KPI[]
  selected: string[]         // kpiIds currently selected
  onSave: (kpiIds: string[]) => void
  onClose: () => void
}

const MAX = 3

export function KPISelector({ branch, kpis, selected, onSave, onClose }: KPISelectorProps) {
  const [draft, setDraft] = useState<string[]>(selected)
  const [query, setQuery] = useState('')
  const [saving, setSaving] = useState(false)

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const filtered = kpis.filter((k) => {
    const q = query.toLowerCase()
    return !q || k.name.toLowerCase().includes(q) || k.category.toLowerCase().includes(q)
  })

  function toggle(kpiId: string) {
    setDraft((prev) => {
      if (prev.includes(kpiId)) return prev.filter((id) => id !== kpiId)
      if (prev.length >= MAX) return prev  // already at cap
      return [...prev, kpiId]
    })
  }

  async function handleSave() {
    setSaving(true)
    await onSave(draft)
    setSaving(false)
  }

  const cfg = branchConfig[branch]

  const bgAccent = {
    executive: 'bg-navy-600',
    legislative: 'bg-civic-blue',
    judicial: 'bg-civic-green',
  }[branch]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className={cn('px-5 py-4 text-white flex items-center justify-between', bgAccent)}>
          <div>
            <h2 className="font-bold text-base">Customize {cfg.label}</h2>
            <p className="text-xs text-white/70 mt-0.5">
              Choose up to {MAX} KPIs to track on your dashboard.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selection counter */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex gap-1.5">
            {Array.from({ length: MAX }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-8 h-2 rounded-full transition-colors',
                  i < draft.length ? bgAccent : 'bg-slate-200'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {draft.length}/{MAX} selected
          </span>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search KPIs..."
              className="input-civic pl-9 text-sm"
            />
          </div>
        </div>

        {/* KPI list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {filtered.map((kpi) => {
            const isSelected = draft.includes(kpi.id)
            const isDisabled = !isSelected && draft.length >= MAX

            return (
              <button
                key={kpi.id}
                type="button"
                disabled={isDisabled}
                onClick={() => toggle(kpi.id)}
                className={cn(
                  'w-full text-left px-5 py-4 flex items-start gap-3 transition',
                  isSelected && 'bg-navy-50',
                  isDisabled && 'opacity-40 cursor-not-allowed',
                  !isSelected && !isDisabled && 'hover:bg-slate-50'
                )}
              >
                {/* Checkbox */}
                <div
                  className={cn(
                    'mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
                    isSelected
                      ? `border-transparent ${bgAccent}`
                      : 'border-slate-300'
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 leading-snug">
                        {kpi.name}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{kpi.category}</p>
                    </div>
                    {kpi.metric?.currentValue !== null && kpi.metric && (
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-slate-900">
                          {formatValue(kpi.metric.currentValue!, kpi.metric.displayFormat)}
                        </div>
                        <div className="flex items-center gap-0.5 justify-end">
                          {kpi.metric.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-600" />}
                          {kpi.metric.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                          {kpi.metric.trend === 'flat' && <Minus className="w-3 h-3 text-slate-400" />}
                          {kpi.metric.trendPeriod && (
                            <span className="text-[10px] text-slate-400">{kpi.metric.trendPeriod}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {kpi.tagline}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || draft.length === 0}
            className={cn(
              'btn-primary flex-1 justify-center disabled:opacity-60 disabled:cursor-not-allowed',
              branch === 'executive' && 'bg-navy-600 hover:bg-navy-700',
              branch === 'legislative' && 'bg-civic-blue hover:bg-blue-700',
              branch === 'judicial' && 'bg-civic-green hover:bg-green-700'
            )}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving…
              </span>
            ) : (
              `Save ${draft.length} KPI${draft.length !== 1 ? 's' : ''}`
            )}
          </button>
        </div>
      </div>
    </>
  )
}
