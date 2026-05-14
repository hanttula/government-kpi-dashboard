import Link from 'next/link'
import { ArrowRight, BarChart3, Shield, TrendingUp, BookOpen, Search, CheckCircle } from 'lucide-react'
import { KPICard } from '@/components/kpi/KPICard'
import { BranchBadge } from '@/components/ui/BranchBadge'
import { getFeaturedKPIs, getKPIsByBranch } from '@/data/kpis'
import { branchConfig } from '@/lib/utils'

export default function HomePage() {
  const featured = getFeaturedKPIs()
  const executiveCount = getKPIsByBranch('executive').length
  const legislativeCount = getKPIsByBranch('legislative').length
  const judicialCount = getKPIsByBranch('judicial').length

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-navy-600 to-navy-700 text-white pt-16 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-navy-100 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full mb-6">
            <Shield className="w-3.5 h-3.5" />
            Nonpartisan · Public Data Only · Objective
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
            Government KPI Dashboard
          </h1>
          <p className="text-lg sm:text-xl text-navy-200 leading-relaxed max-w-2xl mx-auto mb-8">
            Objective performance metrics for the Executive, Legislative, and Judicial branches of
            the U.S. federal government — built from publicly available data.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/kpi-library" className="btn-primary bg-white text-navy-600 hover:bg-navy-50">
              Browse KPI Library
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/methodology" className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/20">
              Our Methodology
            </Link>
          </div>
        </div>
      </section>

      {/* Principles strip */}
      <section className="bg-slate-100 border-y border-slate-200 py-4 px-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-8 min-w-max">
          {[
            { icon: CheckCircle, text: 'Source-linked data' },
            { icon: Search, text: 'Transparent methodology' },
            { icon: BarChart3, text: 'Historical trend tracking' },
            { icon: BookOpen, text: 'Caveat-annotated' },
            { icon: TrendingUp, text: 'Outcome-focused' },
            { icon: Shield, text: 'Non-advocacy' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-slate-600 shrink-0">
              <Icon className="w-4 h-4 text-navy-600" />
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* Branch overview */}
      <section className="py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-header mb-2">Track All Three Branches</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">
              Each branch has its own KPI framework tailored to its constitutional role and
              accountability obligations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(
              [
                {
                  branch: 'executive' as const,
                  count: executiveCount,
                  description:
                    'Budget execution, economic performance, service delivery, regulatory activity, and public trust.',
                  kpis: ['Budget Execution Accuracy', 'Inflation vs. Target', 'Employment Growth'],
                },
                {
                  branch: 'legislative' as const,
                  count: legislativeCount,
                  description:
                    'Bill passage rates, budget timeliness, bipartisan voting, oversight effectiveness, and transparency.',
                  kpis: ['Bill Passage Efficiency', 'Budget Timeliness', 'Bipartisan Voting Rate'],
                },
                {
                  branch: 'judicial' as const,
                  count: judicialCount,
                  description:
                    'Case clearance rates, backlog volume, resolution time, vacancy rates, and access to justice.',
                  kpis: ['Case Clearance Rate', 'Court Backlog', 'Judicial Vacancies'],
                },
              ] as const
            ).map(({ branch, count, description, kpis }) => {
              const cfg = branchConfig[branch]
              return (
                <div
                  key={branch}
                  className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden hover:shadow-card-hover transition-shadow"
                >
                  <div
                    className={`h-2 ${
                      branch === 'executive'
                        ? 'bg-navy-600'
                        : branch === 'legislative'
                        ? 'bg-civic-blue'
                        : 'bg-civic-green'
                    }`}
                  />
                  <div className="p-6">
                    <BranchBadge branch={branch} className="mb-3" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{cfg.label}</h3>
                    <p className="text-sm text-slate-500 mb-4 leading-relaxed">{description}</p>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-2">
                      Sample KPIs
                    </p>
                    <ul className="space-y-1 mb-5">
                      {kpis.map((kpi) => (
                        <li key={kpi} className="text-sm text-slate-600 flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              branch === 'executive'
                                ? 'bg-navy-600'
                                : branch === 'legislative'
                                ? 'bg-civic-blue'
                                : 'bg-civic-green'
                            }`}
                          />
                          {kpi}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-xs text-slate-400">{count} KPIs tracked</span>
                      <Link
                        href={cfg.href}
                        className={`text-sm font-semibold flex items-center gap-1 ${cfg.textClass} hover:underline`}
                      >
                        Explore
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured KPIs */}
      <section className="py-14 px-4 bg-slate-100/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="section-header mb-1">Featured KPI Dashboards</h2>
              <p className="text-sm text-slate-500">
                High-visibility metrics with strong public data sources.
              </p>
            </div>
            <Link
              href="/kpi-library"
              className="text-sm font-medium text-navy-600 hover:underline flex items-center gap-1 shrink-0"
            >
              View all {executiveCount + legislativeCount + judicialCount}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.slice(0, 9).map((kpi) => (
              <KPICard key={kpi.id} kpi={kpi} />
            ))}
          </div>
        </div>
      </section>

      {/* Data philosophy */}
      <section className="py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-header mb-2">Our Data Philosophy</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Every metric is grounded in these principles.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                title: 'Objective public data',
                desc: 'We use data published by federal statistical agencies, official government APIs, and peer-reviewed academic databases. No proprietary or partisan data sources.',
              },
              {
                title: 'Transparent sources',
                desc: 'Every KPI links directly to its source agency, API documentation, and data dictionary. No hidden formulas.',
              },
              {
                title: 'Methodology notes',
                desc: 'We document our formulas, aggregation methods, and the known limitations of each metric. Users can evaluate quality themselves.',
              },
              {
                title: 'Explicit caveats',
                desc: 'Where data has significant gaps, methodological weaknesses, or political sensitivity, we say so clearly. Confidence levels are displayed.',
              },
              {
                title: 'Non-advocacy',
                desc: 'We track performance metrics; we do not advocate for policy outcomes. Rising or falling metrics are presented as observations, not verdicts.',
              },
              {
                title: 'Historical context',
                desc: 'Single-year snapshots are misleading. We emphasize trend data, year-over-year comparisons, and historical averages to provide context.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl border border-slate-100 shadow-card p-5"
              >
                <h3 className="font-semibold text-slate-900 mb-1.5 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-civic-green shrink-0" />
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 bg-navy-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">Suggest a KPI or Data Source</h2>
          <p className="text-navy-200 mb-7 text-sm leading-relaxed">
            Is there a government performance metric you&apos;d like to see tracked? We&apos;re expanding
            the dashboard and want community input on priorities.
          </p>
          <Link href="/contact" className="btn-primary bg-white text-navy-600 hover:bg-navy-50">
            Submit a Request
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
