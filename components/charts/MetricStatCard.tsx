import { TrendingUp, TrendingDown, Minus, Target } from 'lucide-react'
import { cn, formatValue } from '@/lib/utils'
import type { KPIMetric } from '@/lib/types'
import { dataQualityConfig } from '@/lib/utils'

interface MetricStatCardProps {
  metric: KPIMetric
  className?: string
}

export function MetricStatCard({ metric, className }: MetricStatCardProps) {
  const qcfg = dataQualityConfig[metric.dataQuality]

  return (
    <div className={cn('stat-card', className)}>
      <div className="flex items-start justify-between gap-4">
        {/* Main metric */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Current Value
          </p>
          {metric.currentValue !== null ? (
            <p className="text-3xl font-bold text-slate-900 leading-none">
              {formatValue(metric.currentValue, metric.displayFormat)}
            </p>
          ) : (
            <p className="text-xl text-slate-400 italic">Not yet available</p>
          )}
          <p className="text-xs text-slate-500 mt-1">{metric.unit}</p>
        </div>

        {/* Trend indicator */}
        {metric.trend && (
          <div
            className={cn(
              'flex flex-col items-center p-2.5 rounded-lg',
              metric.trend === 'up' && 'bg-green-50',
              metric.trend === 'down' && 'bg-red-50',
              metric.trend === 'flat' && 'bg-slate-50'
            )}
          >
            {metric.trend === 'up' && <TrendingUp className="w-5 h-5 text-civic-green" />}
            {metric.trend === 'down' && <TrendingDown className="w-5 h-5 text-civic-red" />}
            {metric.trend === 'flat' && <Minus className="w-5 h-5 text-slate-400" />}
            {metric.trendValue !== undefined && (
              <span
                className={cn(
                  'text-xs font-semibold mt-0.5',
                  metric.trend === 'up' && 'text-civic-green',
                  metric.trend === 'down' && 'text-civic-red',
                  metric.trend === 'flat' && 'text-slate-400'
                )}
              >
                {metric.trend === 'up' ? '+' : ''}{metric.trendValue}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Benchmark */}
      {metric.benchmark !== undefined && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <Target className="w-3.5 h-3.5 text-civic-amber shrink-0" />
          <span>
            Benchmark: <span className="font-semibold text-slate-700">
              {formatValue(metric.benchmark, metric.displayFormat)}
            </span>
            {metric.benchmarkLabel && ` — ${metric.benchmarkLabel}`}
          </span>
        </div>
      )}

      {/* Trend period and data quality */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
        {metric.trendPeriod && <span>{metric.trendPeriod}</span>}
        {metric.asOfDate && <span>As of {metric.asOfDate}</span>}
        <span className={cn('font-medium flex items-center gap-1', qcfg.color)}>
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full inline-block',
              metric.dataQuality === 'high' && 'bg-civic-green',
              metric.dataQuality === 'medium' && 'bg-civic-amber',
              metric.dataQuality === 'low' && 'bg-civic-red',
              metric.dataQuality === 'estimated' && 'bg-slate-400'
            )}
          />
          {qcfg.label} quality
        </span>
      </div>
    </div>
  )
}
