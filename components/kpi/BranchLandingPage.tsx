import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { KPICard } from '@/components/kpi/KPICard'
import { KPISearch } from '@/components/search/KPISearch'
import { BranchBadge } from '@/components/ui/BranchBadge'
import { branchConfig } from '@/lib/utils'
import type { KPI, Branch } from '@/lib/types'

interface BranchLandingPageProps {
  branch: Branch
  kpis: KPI[]
  description: string
  mission: string
  categories: { name: string; count: number; description: string }[]
}

export function BranchLandingPage({
  branch,
  kpis,
  description,
  mission,
  categories,
}: BranchLandingPageProps) {
  const cfg = branchConfig[branch]
  const featured = kpis.filter((k) => k.featured)

  const heroBg = {
    executive: 'from-navy-600 to-navy-700',
    legislative: 'from-blue-700 to-blue-800',
    judicial: 'from-green-700 to-green-800',
  }[branch]

  return (
    <>
      {/* Hero */}
      <section className={`bg-gradient-to-b ${heroBg} text-white py-14 px-4`}>
        <div className="max-w-4xl mx-auto">
          <BranchBadge branch={branch} className="bg-white/15 border-white/20 text-white mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            {cfg.label} KPI Dashboards
          </h1>
          <p className="text-lg text-white/80 leading-relaxed max-w-2xl mb-6">{description}</p>
          <div className="bg-white/10 rounded-xl p-5 border border-white/20 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">
              What we measure
            </p>
            <p className="text-sm text-white/90 leading-relaxed">{mission}</p>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="border-b border-slate-200 bg-white py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{kpis.length}</div>
            <div className="text-xs text-slate-500 mt-0.5">Total KPIs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{categories.length}</div>
            <div className="text-xs text-slate-500 mt-0.5">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{featured.length}</div>
            <div className="text-xs text-slate-500 mt-0.5">Featured Dashboards</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              {kpis.filter((k) => k.dataSources.some((s) => s.apiAvailable)).length}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">KPIs with APIs</div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
        {/* Categories */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-6">KPI Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="bg-white rounded-xl border border-slate-100 shadow-card p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm text-slate-900">{cat.name}</h3>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      branch === 'executive'
                        ? 'bg-navy-50 text-navy-600'
                        : branch === 'legislative'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-green-50 text-green-700'
                    }`}
                  >
                    {cat.count}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{cat.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured KPIs */}
        {featured.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Featured KPIs</h2>
              <span className="text-sm text-slate-400">{featured.length} highlighted</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((kpi) => (
                <KPICard key={kpi.id} kpi={kpi} />
              ))}
            </div>
          </section>
        )}

        {/* All KPIs search */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-1">All {cfg.label} KPIs</h2>
            <p className="text-sm text-slate-500">
              Search and filter the full {cfg.label} KPI catalog.
            </p>
          </div>
          <KPISearch kpis={kpis} defaultBranch={branch} />
        </section>

        {/* Cross-branch nav */}
        <section className="pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Other Branches
          </p>
          <div className="flex flex-wrap gap-3">
            {(['executive', 'legislative', 'judicial'] as Branch[])
              .filter((b) => b !== branch)
              .map((b) => (
                <Link
                  key={b}
                  href={branchConfig[b].href}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-navy-600 transition"
                >
                  <ArrowRight className="w-4 h-4" />
                  {branchConfig[b].label}
                </Link>
              ))}
          </div>
        </section>
      </div>
    </>
  )
}
