import Link from 'next/link'
import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { BranchBadge } from '@/components/ui/BranchBadge'
import { DataFreshness } from '@/components/ui/DataFreshness'
import { cn, formatValue, branchConfig } from '@/lib/utils'
import type { KPI } from '@/lib/types'

interface KPICardProps {
  kpi: KPI
  variant?: 'default' | 'compact'
}

function TrendIcon({ dir }: { dir: KPI['metric'] extends undefined ? never : NonNullable<KPI['metric']>['trend'] }) {
  if (dir === 'up') return <TrendingUp className="w-4 h-4 text-civic-green" />
  if (dir === 'down') return <TrendingDown className="w-4 h-4 text-civic-red" />
  return <Minus className="w-4 h-4 text-slate-400" />
}

export function KPICard({ kpi, variant = 'default' }: KPICardProps) {
  const branchHref = branchConfig[kpi.branch].href
  const href = `${branchHref}/${kpi.slug}`

  return (
    <Link href={href} className="block group">
      <article className="kpi-card h-full flex flex-col">
        {/* Color accent bar */}
        <div
          className={cn(
            'h-1',
            kpi.branch === 'executive' && 'bg-navy-600',
            kpi.branch === 'legislative' && 'bg-civic-blue',
            kpi.branch === 'judicial' && 'bg-civic-green'
          )}
        />

        <div className="p-5 flex flex-col gap-3 flex-1">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <BranchBadge branch={kpi.branch} size="sm" />
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider shrink-0">
              {kpi.category}
            </span>
          </div>

          {/* Name */}
          <div>
            <h3 className="font-semibold text-slate-900 group-hover:text-navy-600 transition-colors leading-snug text-sm">
              {kpi.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
              {kpi.tagline}
            </p>
          </div>

          {/* Current metric */}
          {kpi.metric && variant === 'default' && (
            <div className="mt-auto pt-3 border-t border-slate-100 flex items-end justify-between">
              <div>
                {kpi.metric.currentValue !== null ? (
                  <>
                    <div className="text-xl font-bold text-slate-900">
                      {formatValue(kpi.metric.currentValue, kpi.metric.displayFormat)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{kpi.metric.unit}</div>
                  </>
                ) : (
                  <div className="text-sm text-slate-400 italic">Data pending</div>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                {kpi.metric.trend && (
                  <>
                    {kpi.metric.trend === 'up' && <TrendingUp className="w-4 h-4 text-civic-green" />}
                    {kpi.metric.trend === 'down' && <TrendingDown className="w-4 h-4 text-civic-red" />}
                    {kpi.metric.trend === 'flat' && <Minus className="w-4 h-4 text-slate-400" />}
                    {kpi.metric.trendPeriod && (
                      <span className="text-[11px]">{kpi.metric.trendPeriod}</span>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 mt-auto">
            <DataFreshness
              frequency={kpi.refreshFrequency}
              quality={kpi.metric?.dataQuality ?? 'medium'}
              className="text-[10px]"
            />
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-navy-600 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </article>
    </Link>
  )
}
