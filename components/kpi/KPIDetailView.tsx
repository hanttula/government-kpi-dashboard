import Link from 'next/link'
import {
  ArrowLeft,
  BarChart2,
  BookOpen,
  Database,
  Info,
  Link2,
  RefreshCw,
  LayoutDashboard,
} from 'lucide-react'
import { BranchBadge } from '@/components/ui/BranchBadge'
import { DataFreshness } from '@/components/ui/DataFreshness'
import { SourceCard } from '@/components/ui/SourceCard'
import { CaveatBanner } from '@/components/ui/CaveatBanner'
import { MetricStatCard } from '@/components/charts/MetricStatCard'
import { TrendChart } from '@/components/charts/TrendChart'
import { KPICard } from '@/components/kpi/KPICard'
import { branchConfig } from '@/lib/utils'
import type { KPI } from '@/lib/types'

const chartTypeLabels: Record<string, string> = {
  line: 'Line Chart',
  bar: 'Bar Chart',
  area: 'Area Chart',
  heatmap: 'Geographic Heatmap',
  scatter: 'Scatter Plot',
  gauge: 'Gauge / Dial',
  table: 'Data Table',
}

interface KPIDetailViewProps {
  kpi: KPI
  relatedKPIs: KPI[]
}

export function KPIDetailView({ kpi, relatedKPIs }: KPIDetailViewProps) {
  const cfg = branchConfig[kpi.branch]
  const preferredChartType = kpi.suggestedCharts?.[0] ?? 'line'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
        <Link href="/" className="hover:text-navy-600 transition">Home</Link>
        <span>/</span>
        <Link href={cfg.href} className="hover:text-navy-600 transition">{cfg.label}</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium truncate">{kpi.shortName}</span>
      </nav>

      {/* Back link */}
      <Link
        href={cfg.href}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-600 transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {cfg.label}
      </Link>

      {/* Hero */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <BranchBadge branch={kpi.branch} />
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide bg-slate-100 px-2.5 py-1 rounded-full">
            {kpi.category}
          </span>
          {kpi.status === 'planned' && (
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              Coming Soon
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">{kpi.name}</h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">{kpi.tagline}</p>
        <div className="mt-4">
          <DataFreshness
            frequency={kpi.refreshFrequency}
            asOfDate={kpi.metric?.asOfDate}
            quality={kpi.metric?.dataQuality ?? 'medium'}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">

          {/* Trend chart */}
          {kpi.historicalData && kpi.historicalData.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="w-4 h-4 text-slate-400" />
                <h2 className="text-base font-semibold text-slate-900">Historical Trend</h2>
                <span className="text-xs text-slate-400 ml-auto italic">
                  Sample / demonstration data — link to live source below
                </span>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 shadow-card p-4">
                <TrendChart
                  data={kpi.historicalData}
                  branch={kpi.branch}
                  type={preferredChartType === 'bar' ? 'bar' : preferredChartType === 'area' ? 'area' : 'line'}
                  benchmark={kpi.metric?.benchmark}
                  benchmarkLabel={kpi.metric?.benchmarkLabel}
                  unit={kpi.metric?.unit}
                  height={240}
                />
              </div>
            </section>
          )}

          {/* What it measures */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-slate-400" />
              <h2 className="text-base font-semibold text-slate-900">What It Measures</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{kpi.whatItMeasures}</p>

            {kpi.formula && (
              <div className="mt-4 bg-slate-50 rounded-lg border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                  Formula
                </p>
                <code className="text-sm font-mono text-navy-600">{kpi.formula}</code>
                {kpi.formulaNote && (
                  <p className="text-xs text-slate-500 mt-2 italic">{kpi.formulaNote}</p>
                )}
              </div>
            )}
          </section>

          {/* Why it matters */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <h2 className="text-base font-semibold text-slate-900">Why It Matters</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{kpi.whyItMatters}</p>
          </section>

          {/* Data caveats */}
          <CaveatBanner caveats={kpi.dataCaveats} />

          {/* Drill-down options */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw className="w-4 h-4 text-slate-400" />
              <h2 className="text-base font-semibold text-slate-900">Drill-Down Options</h2>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {kpi.drillDownOptions.map((d, i) => (
                <li
                  key={i}
                  className="text-sm text-slate-600 flex items-start gap-2 bg-white rounded-lg border border-slate-100 px-3 py-2"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </section>

          {/* Sample dashboard layout */}
          {kpi.sampleDashboardDescription && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <LayoutDashboard className="w-4 h-4 text-slate-400" />
                <h2 className="text-base font-semibold text-slate-900">Suggested Dashboard Layout</h2>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-2">
                  Example Visualization
                </p>
                <p className="text-sm text-blue-900 leading-relaxed">
                  {kpi.sampleDashboardDescription}
                </p>
              </div>
            </section>
          )}

          {/* Chart type suggestions */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 className="w-4 h-4 text-slate-400" />
              <h2 className="text-base font-semibold text-slate-900">Suggested Chart Types</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {kpi.suggestedCharts.map((c) => (
                <span
                  key={c}
                  className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg"
                >
                  {chartTypeLabels[c] ?? c}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Current metric stat */}
          {kpi.metric && <MetricStatCard metric={kpi.metric} />}

          {/* Data sources */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-900">Data Sources</h2>
            </div>
            <div className="space-y-3">
              {kpi.dataSources.map((source) => (
                <SourceCard key={source.name} source={source} />
              ))}
            </div>
          </section>

          {/* Tags */}
          {kpi.tags.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Tags
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {kpi.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>

      {/* Related KPIs */}
      {relatedKPIs.length > 0 && (
        <section className="mt-12 pt-8 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <Link2 className="w-4 h-4 text-slate-400" />
            <h2 className="text-base font-semibold text-slate-900">Related KPIs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedKPIs.map((r) => (
              <KPICard key={r.id} kpi={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
