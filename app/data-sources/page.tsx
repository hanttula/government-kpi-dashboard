import type { Metadata } from 'next'
import { ExternalLink, CheckCircle, XCircle, Database } from 'lucide-react'
import { allKPIs } from '@/data/kpis'
import type { DataSource } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Data Sources',
  description:
    'All public data sources used in the Government KPI Dashboard, including federal APIs, statistical agencies, and research organizations.',
}

function deduplicateSources(kpis: typeof allKPIs): (DataSource & { usedBy: string[] })[] {
  const map = new Map<string, DataSource & { usedBy: string[] }>()
  for (const kpi of kpis) {
    for (const src of kpi.dataSources) {
      if (map.has(src.name)) {
        map.get(src.name)!.usedBy.push(kpi.shortName)
      } else {
        map.set(src.name, { ...src, usedBy: [kpi.shortName] })
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => b.usedBy.length - a.usedBy.length)
}

const agencyGroups: Record<string, string[]> = {
  'Treasury & OMB': ['U.S. Treasury', 'OMB / Treasury', 'OMB'],
  'Labor & Economic': ['BLS', 'BEA', 'St. Louis Fed', 'St. Louis Fed / Treasury', 'St. Louis Fed / BEA'],
  'Congress & Courts': ['Library of Congress', 'Administrative Office of the U.S. Courts', 'Federal Judicial Center', 'Congressional Budget Office', 'Congressional Research Service'],
  'Justice & Immigration': ['DOJ / EOIR', 'DHS / USCIS', 'DHS / CBP', 'Bureau of Justice Statistics / DOJ', 'BJS / DOJ', 'U.S. Sentencing Commission'],
  'Executive Agencies': ['FEMA / DHS', 'FEMA', 'Social Security Administration', 'Department of Veterans Affairs', 'GSA', 'GPO / NARA', 'OMB/OIRA'],
  'Research & Non-Governmental': ['Gallup (non-governmental)', 'Pew Research Center (non-governmental)', 'NSF / University of Michigan', 'GovTrack (third-party, uses official data)', 'ProPublica (non-governmental)', 'VoteSmart (non-governmental)', 'OpenSecrets (non-governmental)', 'SCOTUSblog (non-governmental)', 'Marquette University Law School', 'Demand Progress (non-governmental)', 'RealClearPolitics (aggregator)', 'GovTrack', 'GAO', 'Council of Inspectors General on Integrity and Efficiency', 'U.S. Senate Secretary'],
}

export default function DataSourcesPage() {
  const sources = deduplicateSources(allKPIs)
  const apiSources = sources.filter((s) => s.apiAvailable)
  const nonApiSources = sources.filter((s) => !s.apiAvailable)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Transparency
        </p>
        <h1 className="text-3xl font-bold text-navy-600 mb-3">Data Sources</h1>
        <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
          Every metric in this dashboard is sourced from publicly available federal data. Below is
          the complete index of {sources.length} data sources across {allKPIs.length} KPIs.
          Sources with public APIs are highlighted for potential automated ingestion.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Sources', value: sources.length },
          { label: 'API-Available', value: apiSources.length },
          { label: 'Federal Agencies', value: sources.filter((s) => !s.agency.includes('non-governmental') && !s.agency.includes('aggregator')).length },
          { label: 'KPIs Covered', value: allKPIs.length },
        ].map((stat) => (
          <div key={stat.label} className="stat-card text-center">
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* API-available sources */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-4 h-4 text-civic-green" />
          <h2 className="text-lg font-bold text-slate-900">Sources with Public APIs</h2>
          <span className="text-xs bg-green-50 text-green-700 font-medium px-2 py-0.5 rounded-full">
            {apiSources.length} sources
          </span>
        </div>
        <p className="text-sm text-slate-500 mb-5">
          These sources support automated data ingestion via documented APIs, enabling real-time
          dashboard updates when connected to an ETL pipeline.
        </p>
        <div className="space-y-3">
          {apiSources.map((src) => (
            <SourceRow key={src.name} src={src} />
          ))}
        </div>
      </section>

      {/* Non-API sources */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <XCircle className="w-4 h-4 text-slate-400" />
          <h2 className="text-lg font-bold text-slate-900">Manual / PDF Sources</h2>
          <span className="text-xs bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-full">
            {nonApiSources.length} sources
          </span>
        </div>
        <p className="text-sm text-slate-500 mb-5">
          These sources require manual download, web scraping, or PDF parsing. They are candidates
          for structured web scraping or scheduled document ingestion in a production ETL pipeline.
        </p>
        <div className="space-y-3">
          {nonApiSources.map((src) => (
            <SourceRow key={src.name} src={src} />
          ))}
        </div>
      </section>

      {/* Note on non-governmental sources */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-5 mt-8">
        <div className="flex items-start gap-3">
          <Database className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-amber-900 mb-1">
              Note on Non-Governmental Sources
            </h3>
            <p className="text-sm text-amber-800 leading-relaxed">
              A subset of KPIs (primarily public trust and confidence metrics, and congressional
              voting analysis) rely on data from non-governmental organizations such as Gallup, Pew
              Research Center, GovTrack, and ProPublica. These organizations use rigorous
              methodologies, but they are independent of the federal government and subject to their
              own methodological limitations and potential institutional biases. Where non-governmental
              sources are used, this is noted on each KPI detail page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SourceRow({ src }: { src: DataSource & { usedBy: string[] } }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-slate-900">{src.name}</span>
            {src.apiAvailable && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded">
                API
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500">{src.agency}</div>
        </div>
        <a
          href={src.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-navy-600 p-1.5 rounded-md hover:bg-slate-50 transition shrink-0"
          aria-label={`Open ${src.name}`}
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-500">
        <span>Updated: {src.updateFrequency}</span>
        <span>Used by: {src.usedBy.join(', ')}</span>
      </div>
      {src.notes && (
        <p className="mt-2 text-xs text-slate-400 italic">{src.notes}</p>
      )}
    </div>
  )
}
