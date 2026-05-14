import type { Metadata } from 'next'
import { CheckCircle, AlertTriangle, BarChart2, RefreshCw, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Methodology',
  description:
    'How Government KPI Dashboard selects, measures, aggregates, and presents government performance data.',
}

export default function MethodologyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Transparency
        </p>
        <h1 className="text-3xl font-bold text-navy-600 mb-3">Methodology</h1>
        <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
          How we select, measure, aggregate, and present government performance metrics. We believe
          transparency about our own methodology is as important as the data we present.
        </p>
      </div>

      <div className="space-y-10">
        {/* Core principles */}
        <Section icon={<CheckCircle className="w-5 h-5 text-civic-green" />} title="Core Principles">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {[
              {
                title: 'Objectivity',
                body: 'KPIs are selected based on their ability to measure government performance objectively, not on whether they reflect positively or negatively on any administration, party, or ideology.',
              },
              {
                title: 'Public data only',
                body: 'All data comes from official government sources (federal statistical agencies, public APIs, official reports) or from established, peer-reviewed research organizations. No proprietary data.',
              },
              {
                title: 'Reproducibility',
                body: 'All formulas, data sources, and aggregation methods are documented so that any informed person can reproduce our numbers from the original sources.',
              },
              {
                title: 'Honest uncertainty',
                body: 'Where data quality is limited, methodology is contested, or coverage is incomplete, we say so explicitly with caveat banners and data quality indicators.',
              },
              {
                title: 'Trend over snapshot',
                body: 'Single data points are typically misleading. We prioritize multi-year historical trend data and year-over-year comparisons over current-period snapshots.',
              },
              {
                title: 'Non-advocacy',
                body: 'We present metrics and trends without prescribing policy solutions. A rising or falling metric is presented as an observation, not a political verdict.',
              },
            ].map((p) => (
              <div key={p.title} className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{p.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* KPI Selection */}
        <Section icon={<BookOpen className="w-5 h-5 text-navy-600" />} title="KPI Selection Criteria">
          <Prose>
            KPIs are selected based on the following criteria, applied in order:
          </Prose>
          <ol className="mt-4 space-y-3 list-none">
            {[
              ['Data availability', 'A reliable public data source must exist with at least 3 years of historical data. Planned KPIs for which no current public source exists are marked "Coming Soon."'],
              ['Outcome orientation', 'We prefer metrics that measure outcomes (what actually happened) over inputs (what was spent) or outputs (what was produced), though all three can be valuable.'],
              ['Constitutional relevance', 'Each KPI must be directly relevant to the constitutional or statutory functions of the branch it is placed under.'],
              ['Measurability', 'The metric must have a clear, documented formula with defined numerator, denominator, and measurement period.'],
              ['Non-redundancy', 'We avoid duplicating information across KPIs unless the same underlying phenomenon is measured from usefully different angles.'],
              ['Public interest', 'KPIs must be of genuine civic interest — metrics that policy-aware citizens, journalists, researchers, or public officials would find actionable.'],
            ].map(([title, body], i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-navy-50 text-navy-600 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <span className="text-sm font-semibold text-slate-800">{title}: </span>
                  <span className="text-sm text-slate-600">{body}</span>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* Data quality ratings */}
        <Section icon={<BarChart2 className="w-5 h-5 text-slate-500" />} title="Data Quality Ratings">
          <Prose>
            Each KPI displays a data quality rating based on the following scale:
          </Prose>
          <div className="mt-4 space-y-3">
            {[
              {
                label: 'High',
                color: 'bg-green-50 border-green-200 text-green-900',
                badge: 'bg-green-100 text-green-700',
                desc: 'Data is published by a federal statistical agency (e.g., BLS, BEA, U.S. Courts) with documented, peer-reviewed methodology. Historical series is complete and machine-readable.',
              },
              {
                label: 'Medium',
                color: 'bg-amber-50 border-amber-200 text-amber-900',
                badge: 'bg-amber-100 text-amber-700',
                desc: 'Data is generally reliable but has known gaps, definitional inconsistencies, or a methodology that has changed over time. Self-reported data from agencies also falls here.',
              },
              {
                label: 'Low',
                color: 'bg-red-50 border-red-200 text-red-900',
                badge: 'bg-red-100 text-red-700',
                desc: 'Data coverage is incomplete, depends on voluntary reporting, or lacks an authoritative source. These KPIs are included for completeness but should be interpreted with significant caution.',
              },
              {
                label: 'Estimated',
                color: 'bg-slate-50 border-slate-200 text-slate-700',
                badge: 'bg-slate-100 text-slate-600',
                desc: 'Values are model-based estimates, interpolated from partial sources, or are third-party calculations not directly published by the primary agency.',
              },
            ].map((q) => (
              <div key={q.label} className={`rounded-xl border p-4 ${q.color}`}>
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${q.badge} mr-2`}>
                  {q.label}
                </span>
                <span className="text-sm leading-relaxed">{q.desc}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Update frequency */}
        <Section icon={<RefreshCw className="w-5 h-5 text-slate-500" />} title="Update Frequency">
          <Prose>
            Each KPI is tagged with the cadence at which the underlying source data is published.
            This dashboard is currently in a static-data MVP phase — the sample historical data
            is pre-loaded from official published sources as of mid-2024. In a production deployment
            with an ETL pipeline, KPIs with API-available sources would update automatically.
          </Prose>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              ['Daily', 'Debt-to-the-penny (Treasury), USAspending contract data, Federal Register'],
              ['Monthly', 'BLS employment, CPI, FRED series, FEMA declarations, USCIS processing times'],
              ['Quarterly', 'GDP, FRED fiscal data, U.S. Courts clearance rates, lobbying disclosure'],
              ['Annual', 'Public trust surveys, U.S. Courts statistics, USSC sentencing data, FJC data'],
              ['Per Congress', 'Bill passage rates, bipartisan voting rates, budget timeliness'],
              ['Per Term / Event', 'Judicial vacancy data (updated weekly), SCOTUS confidence polls'],
            ].map(([freq, examples]) => (
              <div key={freq} className="bg-white rounded-xl border border-slate-100 shadow-card p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-navy-600 mb-1">{freq}</div>
                <div className="text-xs text-slate-500">{examples}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Caveats and limitations */}
        <Section icon={<AlertTriangle className="w-5 h-5 text-civic-amber" />} title="Known Limitations">
          <div className="space-y-4 mt-4">
            {[
              {
                title: 'Sample data in MVP',
                body: 'This dashboard is currently an MVP with pre-loaded historical data. The data is drawn from official published reports but is not yet connected to live APIs. Figures should be verified against primary sources before being cited.',
              },
              {
                title: 'Federal scope only',
                body: 'This dashboard covers federal government institutions. State, county, and municipal government performance is not yet included, though the KPI framework is designed to support drill-downs to state and local levels where data is available.',
              },
              {
                title: 'Polling data limitations',
                body: 'Public trust and approval metrics depend on polling data, which has known limitations including declining response rates, weighting methodology disputes, and question wording effects. Polling trends are useful directionally but should not be treated as precise measurements.',
              },
              {
                title: 'Operational vs. policy performance',
                body: 'This dashboard measures operational and institutional performance (how government functions), not policy outcomes (whether specific policies achieve their goals). The distinction matters: a government can execute a budget efficiently while pursuing policies that many citizens view as harmful, and vice versa.',
              },
              {
                title: 'No composite scores',
                body: 'We intentionally do not publish composite scores, letter grades, or rankings across administrations. Such aggregations require normative weighting choices that would introduce political bias. We present individual metrics and let users draw their own conclusions.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ETL roadmap */}
        <section className="bg-navy-50 rounded-2xl border border-navy-100 p-6">
          <h2 className="text-lg font-bold text-navy-600 mb-3">Roadmap: Automated ETL Pipeline</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            The architecture for automated data ingestion is described in the deployment documentation.
            Priority APIs for scheduled ingestion (via cron jobs or a workflow orchestrator like
            Apache Airflow or Prefect) are:
          </p>
          <ul className="space-y-2 text-sm text-slate-700">
            {[
              'BLS Public Data API — CPI, employment data (monthly)',
              'FRED API — PCE, GDP, debt/GDP ratio (monthly/quarterly)',
              'USAspending.gov API — outlay execution, contract competition rates (monthly)',
              'Congress.gov API — bill counts, vote records (daily during session)',
              'FEMA OpenFEMA API — disaster declarations (as declared)',
              'U.S. Courts public data tables — clearance rates, caseload (quarterly)',
              'Senate LDA API — lobbying disclosures (quarterly)',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-navy-400 mt-1">→</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
        {icon}
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function Prose({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-slate-600 leading-relaxed">{children}</p>
}
