'use client'

import { useState, useCallback } from 'react'
import { Settings2, RefreshCw } from 'lucide-react'
import { MiniKPICard } from './MiniKPICard'
import { KPISelector } from './KPISelector'
import { BranchBadge } from '@/components/ui/BranchBadge'
import { branchConfig } from '@/lib/utils'
import type { KPI, Branch } from '@/lib/types'
import { cn } from '@/lib/utils'

interface BranchPrefs {
  branch: Branch
  kpiIds: string[]
}

interface PersonalDashboardProps {
  userName: string
  initialPrefs: BranchPrefs[]
  kpisByBranch: Record<Branch, KPI[]>
  allKPIs: KPI[]
}

const BRANCHES: Branch[] = ['executive', 'legislative', 'judicial']

const branchBg = {
  executive: 'from-navy-600 to-navy-700',
  legislative: 'from-blue-700 to-blue-800',
  judicial: 'from-green-700 to-green-800',
}

const branchAddBtn = {
  executive: 'border-navy-400/40 text-navy-200 hover:bg-white/10',
  legislative: 'border-blue-400/40 text-blue-200 hover:bg-white/10',
  judicial: 'border-green-400/40 text-green-200 hover:bg-white/10',
}

export function PersonalDashboard({
  userName,
  initialPrefs,
  kpisByBranch,
  allKPIs,
}: PersonalDashboardProps) {
  // prefs: { executive: [...kpiIds], legislative: [...], judicial: [...] }
  const [prefs, setPrefs] = useState<Record<Branch, string[]>>(() => {
    const map: Record<Branch, string[]> = { executive: [], legislative: [], judicial: [] }
    for (const p of initialPrefs) map[p.branch] = p.kpiIds
    return map
  })

  const [selectorBranch, setSelectorBranch] = useState<Branch | null>(null)
  const [savingBranch, setSavingBranch] = useState<Branch | null>(null)

  function getSelectedKPIs(branch: Branch): KPI[] {
    return prefs[branch]
      .map((id) => allKPIs.find((k) => k.id === id))
      .filter(Boolean) as KPI[]
  }

  const handleSave = useCallback(
    async (branch: Branch, kpiIds: string[]) => {
      setSavingBranch(branch)
      try {
        const res = await fetch('/api/preferences', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ branch, kpiIds }),
        })
        if (res.ok) {
          setPrefs((prev) => ({ ...prev, [branch]: kpiIds }))
        }
      } finally {
        setSavingBranch(null)
        setSelectorBranch(null)
      }
    },
    []
  )

  return (
    <>
      {/* Page header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {userName.split(' ')[0]}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Your personalized government KPI dashboard — 3 metrics per branch, updated from public data.
          </p>
        </div>
      </div>

      {/* Branch sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
        {BRANCHES.map((branch) => {
          const cfg = branchConfig[branch]
          const selectedKPIs = getSelectedKPIs(branch)
          const isSaving = savingBranch === branch
          const emptySlots = 3 - selectedKPIs.length

          return (
            <section key={branch}>
              {/* Branch header bar */}
              <div className={cn('rounded-t-2xl bg-gradient-to-r px-5 py-4 flex items-center justify-between', branchBg[branch])}>
                <div className="flex items-center gap-3">
                  <BranchBadge
                    branch={branch}
                    className="bg-white/15 border-white/20 text-white"
                  />
                  <div>
                    <h2 className="text-base font-bold text-white">{cfg.label}</h2>
                    <p className="text-xs text-white/60 mt-0.5">
                      {selectedKPIs.length} of 3 metrics selected
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectorBranch(branch)}
                  disabled={isSaving}
                  className={cn(
                    'flex items-center gap-1.5 text-xs font-medium border rounded-lg px-3 py-1.5 transition',
                    branchAddBtn[branch]
                  )}
                >
                  {isSaving ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Settings2 className="w-3.5 h-3.5" />
                  )}
                  {isSaving ? 'Saving…' : 'Customize'}
                </button>
              </div>

              {/* KPI cards grid */}
              <div className="bg-slate-50 rounded-b-2xl border border-t-0 border-slate-100 p-5">
                {selectedKPIs.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-400 text-sm mb-3">No KPIs selected for this branch yet.</p>
                    <button
                      onClick={() => setSelectorBranch(branch)}
                      className={cn(
                        'text-sm font-semibold px-4 py-2 rounded-lg border transition',
                        branch === 'executive' && 'text-navy-600 border-navy-200 hover:bg-navy-50',
                        branch === 'legislative' && 'text-blue-600 border-blue-200 hover:bg-blue-50',
                        branch === 'judicial' && 'text-green-700 border-green-200 hover:bg-green-50'
                      )}
                    >
                      + Choose KPIs
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedKPIs.map((kpi) => (
                      <MiniKPICard key={kpi.id} kpi={kpi} />
                    ))}
                    {/* Empty slot placeholders */}
                    {emptySlots > 0 &&
                      Array.from({ length: emptySlots }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectorBranch(branch)}
                          className="rounded-xl border-2 border-dashed border-slate-200 bg-white/50 hover:bg-white hover:border-slate-300 transition flex flex-col items-center justify-center gap-2 py-10 text-slate-400 text-sm"
                        >
                          <span className="text-2xl font-light">+</span>
                          <span>Add a KPI</span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </section>
          )
        })}
      </div>

      {/* KPI Selector drawer */}
      {selectorBranch && (
        <KPISelector
          branch={selectorBranch}
          kpis={kpisByBranch[selectorBranch]}
          selected={prefs[selectorBranch]}
          onSave={(ids) => handleSave(selectorBranch, ids)}
          onClose={() => setSelectorBranch(null)}
        />
      )}
    </>
  )
}
