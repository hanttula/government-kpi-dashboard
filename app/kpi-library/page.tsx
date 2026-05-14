import type { Metadata } from 'next'
import { KPISearch } from '@/components/search/KPISearch'
import { allKPIs } from '@/data/kpis'

export const metadata: Metadata = {
  title: 'KPI Library — All 30 Government Performance Metrics',
  description:
    'Browse all 30 government KPI dashboards across the Executive, Legislative, and Judicial branches. Filter by branch, category, and data update frequency.',
}

export default function KPILibraryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Full Index
        </p>
        <h1 className="text-3xl font-bold text-navy-600 mb-3">KPI Library</h1>
        <p className="text-slate-500 max-w-2xl text-sm leading-relaxed">
          All {allKPIs.length} performance indicators tracked across the Executive, Legislative, and
          Judicial branches of the U.S. federal government. Each KPI links to a full detail page
          with data sources, methodology, caveats, and suggested dashboard layouts.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-8 p-4 bg-white rounded-xl border border-slate-100 shadow-card text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-navy-600" />
          Executive Branch
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-civic-blue" />
          Legislative Branch
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-civic-green" />
          Judicial Branch
        </div>
        <div className="ml-auto text-slate-400">
          Indicator bars at top of each card denote branch.
        </div>
      </div>

      {/* Search + Grid */}
      <KPISearch kpis={allKPIs} />
    </div>
  )
}
