/**
 * FRED API (St. Louis Fed) — optional, requires FRED_API_KEY env var
 * Free key: https://fred.stlouisfed.org/docs/api/api_key.html
 *
 * Fetches exec-005: Federal Debt as % of GDP (series GFDEGDQ188S, quarterly)
 */
import type { LiveKPIUpdate } from './types'

const FRED_BASE = 'https://api.stlouisfed.org/fred/series/observations'
const DEBT_GDP_SERIES = 'GFDEGDQ188S' // Federal Debt: Total Public Debt as % of GDP

interface FREDObservation {
  date: string
  value: string
}

export async function fetchDebtToGDP(): Promise<LiveKPIUpdate> {
  const apiKey = process.env.FRED_API_KEY
  if (!apiKey) throw new Error('FRED_API_KEY not configured')

  const url =
    `${FRED_BASE}?series_id=${DEBT_GDP_SERIES}` +
    `&api_key=${apiKey}&file_type=json` +
    `&sort_order=desc&limit=80` +
    `&observation_start=2000-01-01`

  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`FRED HTTP ${res.status}`)
  const json = await res.json()

  const observations: FREDObservation[] = (json.observations as FREDObservation[]).filter(
    (o) => o.value !== '.',
  )

  if (observations.length < 5) throw new Error('Insufficient FRED data')

  // Most recent quarterly reading
  const latest = observations[0]
  const currentValue = parseFloat(latest.value)

  // Year-ago reading (4 quarters back)
  const yearAgoValue = parseFloat(
    (observations[4] ?? observations[observations.length - 1]).value,
  )
  const trendValue = +(currentValue - yearAgoValue).toFixed(1)

  // Historical annual data — use Q3 observation (July date = Q3) as fiscal year proxy
  const byYear: Record<number, number> = {}
  for (const obs of observations) {
    const date = new Date(obs.date)
    const yr = date.getFullYear()
    const mo = date.getMonth() // 0-indexed; July = 6
    if (mo === 6 && byYear[yr] === undefined) {
      byYear[yr] = parseFloat(obs.value)
    }
  }

  const ANNOTATIONS: Record<string, string> = {
    '2010': 'Post-financial crisis stimulus',
    '2020': 'COVID pandemic spending',
  }

  const historicalData = Object.entries(byYear)
    .filter(([, v]) => !isNaN(v))
    .map(([yr, v]) => {
      const entry: { period: string; value: number; annotation?: string } = {
        period: yr,
        value: +v.toFixed(1),
      }
      if (ANNOTATIONS[yr]) entry.annotation = ANNOTATIONS[yr]
      return entry
    })
    .sort((a, b) => +a.period - +b.period)

  return {
    kpiId: 'exec-005',
    currentValue: +currentValue.toFixed(1),
    trendValue,
    trend: trendValue > 1 ? 'up' : trendValue < -1 ? 'down' : 'flat',
    asOfDate: latest.date,
    historicalData,
  }
}
