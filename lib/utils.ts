import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Branch, DataQuality, RefreshFrequency, TrendDirection } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatValue(value: number | null, displayFormat: string): string {
  if (value === null) return 'N/A'
  const formatted = Math.abs(value) >= 1000000
    ? (value / 1000000).toFixed(1) + 'M'
    : Math.abs(value) >= 1000
    ? value.toLocaleString()
    : value.toLocaleString(undefined, { maximumFractionDigits: 1 })
  return displayFormat.replace('{value}', formatted)
}

export const branchConfig: Record<
  Branch,
  { label: string; color: string; bgClass: string; textClass: string; borderClass: string; href: string }
> = {
  executive: {
    label: 'Executive Branch',
    color: '#1E3A5F',
    bgClass: 'bg-navy-600',
    textClass: 'text-navy-600',
    borderClass: 'border-navy-600',
    href: '/executive',
  },
  legislative: {
    label: 'Legislative Branch',
    color: '#2563EB',
    bgClass: 'bg-civic-blue',
    textClass: 'text-civic-blue',
    borderClass: 'border-civic-blue',
    href: '/legislative',
  },
  judicial: {
    label: 'Judicial Branch',
    color: '#16A34A',
    bgClass: 'bg-civic-green',
    textClass: 'text-civic-green',
    borderClass: 'border-civic-green',
    href: '/judicial',
  },
}

export const refreshLabels: Record<RefreshFrequency, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annual: 'Annual',
}

export const dataQualityConfig: Record<
  DataQuality,
  { label: string; color: string; description: string }
> = {
  high: {
    label: 'High',
    color: 'text-civic-green',
    description: 'Published by a federal statistical agency; methodology is well-documented.',
  },
  medium: {
    label: 'Medium',
    color: 'text-civic-amber',
    description: 'Data quality is generally reliable but has known gaps or methodology limitations.',
  },
  low: {
    label: 'Low',
    color: 'text-civic-red',
    description: 'Data is incomplete, self-reported, or lacks comprehensive coverage.',
  },
  estimated: {
    label: 'Estimated',
    color: 'text-slate-500',
    description: 'Values are model-based estimates or imputed from partial sources.',
  },
}

export function trendLabel(dir: TrendDirection, value?: number, period?: string): string {
  const sign = dir === 'up' ? '+' : dir === 'down' ? '' : ''
  const mag = value !== undefined ? ` ${sign}${value}` : ''
  const per = period ? ` ${period}` : ''
  return `${dir === 'up' ? '↑' : dir === 'down' ? '↓' : '→'}${mag}${per}`
}

export function trendColorClass(dir: TrendDirection): string {
  if (dir === 'up') return 'text-civic-green'
  if (dir === 'down') return 'text-civic-red'
  return 'text-slate-500'
}

export function slugToBreadcrumb(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
