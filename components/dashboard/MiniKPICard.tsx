'use client'

import Link from 'next/link'
import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import { cn, formatValue, branchConfig } from '@/lib/utils'
import type { KPI } from '@/lib/types'

const branchLineColor: Record<KPI['branch'], string> = {
  executive: '#1E3A5F',
  legislative: '#2563EB',
  judicial: '#16A34A',
}

interface MiniKPICardProps {
  kpi: KPI
  className?: string
}

function Sparkline({ kpi }: { kpi: KPI }) {
  const data = kpi.historicalData ?? []
  if (data.length < 2) {
    return (
      <div className="h-[72px] flex items-center justify-center text-[11px] text-slate-300">
        No trend data
      </div>
    )
  }
  const color = branchLineColor[kpi.branch]
  return (
    <div className="h-[72px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
          {kpi.metric?.benchmark !== undefined && (
            <ReferenceLine
              y={kpi.metric.benchmark}
              stroke="#D97706"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
          )}
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const pt = payload[0].payload as { period: string; value: number }
              return (
                <div className="bg-white border border-slate-200 rounded px-2 py-1 text-[11px] shadow">
                  <span className="text-slate-500">{pt.period}: </span>
                  <span className="font-semibold text-slate-800">
                    {kpi.metric ? formatValue(pt.value, kpi.metric.displayFormat) : pt.value}
                  </span>
                </div>
              )
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function MiniKPICard({ kpi, className }: MiniKPICardProps) {
  const href = `${branchConfig[kpi.branch].href}/${kpi.slug}`
  const metric = kpi.metric

  return (
    <div className={cn('bg-white rounded-xl border border-slate-100 shadow-card group', className)}>
      {/* Top strip */}
      <div
        className={cn(
          'h-0.5 rounded-t-xl',
          kpi.branch === 'executive' && 'bg-navy-600',
          kpi.branch === 'legislative' && 'bg-civic-blue',
          kpi.branch === 'judicial' && 'bg-civic-green'
        )}
      />

      <div className="p-4">
        {/* KPI name */}
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
          {kpi.category}
        </p>
        <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 mb-3">
          {kpi.name}
        </h3>

        {/* Current value + trend */}
        {metric ? (
          <div className="flex items-end justify-between mb-3">
            <div>
              {metric.currentValue !== null ? (
                <>
                  <div className="text-2xl font-bold text-slate-900 leading-none">
                    {formatValue(metric.currentValue, metric.displayFormat)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{metric.unit}</div>
                </>
              ) : (
                <div className="text-sm text-slate-400 italic">Pending</div>
              )}
            </div>
            {metric.trend && metric.trendValue !== undefined && (
              <div
                className={cn(
                  'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg',
                  metric.trend === 'up' && 'bg-green-50 text-green-700',
                  metric.trend === 'down' && 'bg-red-50 text-red-700',
                  metric.trend === 'flat' && 'bg-slate-50 text-slate-500'
                )}
              >
                {metric.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                {metric.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                {metric.trend === 'flat' && <Minus className="w-3 h-3" />}
                {metric.trend === 'up' ? '+' : ''}{metric.trendValue}
              </div>
            )}
          </div>
        ) : null}

        {/* Sparkline */}
        <Sparkline kpi={kpi} />

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
          {metric?.asOfDate && (
            <span className="text-[10px] text-slate-400">As of {metric.asOfDate}</span>
          )}
          <Link
            href={href}
            className={cn(
              'ml-auto flex items-center gap-1 text-[11px] font-semibold transition',
              kpi.branch === 'executive' && 'text-navy-600 hover:text-navy-700',
              kpi.branch === 'legislative' && 'text-blue-600 hover:text-blue-700',
              kpi.branch === 'judicial' && 'text-green-700 hover:text-green-800'
            )}
          >
            Full details
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}
