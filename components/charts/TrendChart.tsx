'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
} from 'recharts'
import type { DataPoint, Branch } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TrendChartProps {
  data: DataPoint[]
  branch: Branch
  type?: 'line' | 'area' | 'bar'
  benchmark?: number
  benchmarkLabel?: string
  unit?: string
  height?: number
  className?: string
}

const branchColors: Record<Branch, { stroke: string; fill: string }> = {
  executive: { stroke: '#1E3A5F', fill: '#1E3A5F' },
  legislative: { stroke: '#2563EB', fill: '#2563EB' },
  judicial: { stroke: '#16A34A', fill: '#16A34A' },
}

interface TooltipPayload {
  payload?: {
    value: number
    payload: DataPoint
  }[]
  active?: boolean
  label?: string
  unit?: string
}

function CustomTooltip({ active, payload, label, unit }: TooltipPayload) {
  if (!active || !payload?.length) return null
  const point = payload[0]
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs max-w-[200px]">
      <p className="font-semibold text-slate-700 mb-1">{label ?? point.payload.period}</p>
      <p className="text-slate-900 font-bold text-sm">
        {point.value?.toLocaleString()}
        {unit && <span className="text-slate-500 font-normal ml-1">{unit}</span>}
      </p>
      {point.payload.annotation && (
        <p className="text-amber-700 mt-1 italic leading-tight">{point.payload.annotation}</p>
      )}
    </div>
  )
}

export function TrendChart({
  data,
  branch,
  type = 'line',
  benchmark,
  benchmarkLabel,
  unit,
  height = 220,
  className,
}: TrendChartProps) {
  const colors = branchColors[branch]
  const hasAnnotations = data.some((d) => d.annotation)

  if (!data.length) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-sm text-slate-400',
          className
        )}
        style={{ height }}
      >
        No historical data available
      </div>
    )
  }

  const commonProps = {
    data,
    margin: { top: 10, right: 20, left: 0, bottom: 0 },
  }

  const axisProps = {
    xAxis: (
      <XAxis
        dataKey="period"
        tick={{ fontSize: 11, fill: '#94a3b8' }}
        tickLine={false}
        axisLine={false}
      />
    ),
    yAxis: (
      <YAxis
        tick={{ fontSize: 11, fill: '#94a3b8' }}
        tickLine={false}
        axisLine={false}
        width={45}
        tickFormatter={(v: number) =>
          Math.abs(v) >= 1000000
            ? (v / 1000000).toFixed(1) + 'M'
            : Math.abs(v) >= 1000
            ? (v / 1000).toFixed(0) + 'K'
            : v.toString()
        }
      />
    ),
    grid: (
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tooltip: <Tooltip content={(props: any) => <CustomTooltip {...props} unit={unit} />} />,
    reference: benchmark !== undefined && (
      <ReferenceLine
        y={benchmark}
        stroke="#D97706"
        strokeDasharray="4 4"
        strokeWidth={1.5}
        label={benchmarkLabel ? {
          value: benchmarkLabel,
          position: 'right',
          fontSize: 10,
          fill: '#D97706',
        } : undefined}
      />
    ),
  }

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {type === 'bar' ? (
          <BarChart {...commonProps}>
            {axisProps.grid}
            {axisProps.xAxis}
            {axisProps.yAxis}
            {axisProps.tooltip}
            {axisProps.reference || <></>}
            <Bar dataKey="value" radius={[3, 3, 0, 0]}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.value < 0 ? '#DC2626' : colors.fill}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        ) : type === 'area' ? (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id={`grad-${branch}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.fill} stopOpacity={0.15} />
                <stop offset="95%" stopColor={colors.fill} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            {axisProps.grid}
            {axisProps.xAxis}
            {axisProps.yAxis}
            {axisProps.tooltip}
            {axisProps.reference || <></>}
            <Area
              type="monotone"
              dataKey="value"
              stroke={colors.stroke}
              strokeWidth={2}
              fill={`url(#grad-${branch})`}
              dot={data.length <= 12}
              activeDot={{ r: 5, fill: colors.stroke }}
            />
          </AreaChart>
        ) : (
          <LineChart {...commonProps}>
            {axisProps.grid}
            {axisProps.xAxis}
            {axisProps.yAxis}
            {axisProps.tooltip}
            {axisProps.reference || <></>}
            <Line
              type="monotone"
              dataKey="value"
              stroke={colors.stroke}
              strokeWidth={2.5}
              dot={data.length <= 15 ? { r: 4, fill: '#fff', strokeWidth: 2, stroke: colors.stroke } : false}
              activeDot={{ r: 6, fill: colors.stroke }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
