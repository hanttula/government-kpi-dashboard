/**
 * Bureau of Labor Statistics API (public, no key required)
 * Fetches CPI (exec-002) and nonfarm payroll (exec-003)
 */
import type { LiveKPIUpdate } from './types'

const BLS_URL = 'https://api.bls.gov/publicAPI/v2/timeseries/data/'
const CPI_SERIES = 'CUSR0000SA0'       // CPI-U All Items, Seasonally Adjusted
const PAYROLL_SERIES = 'CES0000000001' // Total Nonfarm Payroll SA, thousands

interface BLSPoint {
  year: string
  period: string   // 'M01'–'M12' | 'M13' (annual avg)
  value: string
}

interface BLSSeries {
  seriesID: string
  data: BLSPoint[]
}

async function fetchBLSSeries(
  seriesIds: string[],
  startYear: number,
  endYear: number,
): Promise<BLSSeries[]> {
  const body: Record<string, unknown> = {
    seriesid: seriesIds,
    startyear: startYear.toString(),
    endyear: endYear.toString(),
  }
  // Use registered API key if available — higher rate limits and more current data
  if (process.env.BLS_API_KEY) body.registrationkey = process.env.BLS_API_KEY

  const res = await fetch(BLS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`BLS HTTP ${res.status}`)
  const json = await res.json()
  if (json.status !== 'REQUEST_SUCCEEDED') {
    throw new Error(`BLS error: ${JSON.stringify(json.message)}`)
  }
  return json.Results.series as BLSSeries[]
}

/** Sort monthly BLS data points newest-first, excluding annual averages (M13) */
function sortNewestFirst(data: BLSPoint[]): BLSPoint[] {
  return [...data]
    .filter((d) => d.period.startsWith('M') && d.period !== 'M13')
    .sort((a, b) => {
      const n = (p: BLSPoint) => parseInt(p.year) * 100 + parseInt(p.period.slice(1))
      return n(b) - n(a)
    })
}

/** Build year-month lookup: "2024-M01" → numeric value */
function buildYMMap(data: BLSPoint[]): Record<string, number> {
  const map: Record<string, number> = {}
  for (const p of data) {
    if (p.period !== 'M13') map[`${p.year}-${p.period}`] = parseFloat(p.value)
  }
  return map
}

/**
 * exec-002: Inflation trend vs. Fed target (CPI YoY %)
 */
export async function fetchInflation(startYear: number, endYear: number): Promise<LiveKPIUpdate> {
  // Need one extra prior year to compute YoY for startYear
  const [series] = await fetchBLSSeries([CPI_SERIES], startYear - 1, endYear)
  const points = sortNewestFirst(series.data) // newest first

  if (points.length < 13) throw new Error('Insufficient CPI data for YoY calculation')

  // Current 12-month inflation
  const latest = parseFloat(points[0].value)
  const yearAgo = parseFloat(points[12].value)
  const currentYoY = ((latest - yearAgo) / yearAgo) * 100

  // Previous month's 12-month inflation (for trend direction)
  const prevLatest = parseFloat(points[1].value)
  const prevYearAgo = points.length >= 14 ? parseFloat(points[13].value) : yearAgo
  const prevYoY = ((prevLatest - prevYearAgo) / prevYearAgo) * 100
  const trendValue = currentYoY - prevYoY

  // as-of date
  const p0 = points[0]
  const month = parseInt(p0.period.slice(1))
  const asOfDate = `${p0.year}-${String(month).padStart(2, '0')}-01`

  // Historical: December-to-December YoY for each year
  const ymMap = buildYMMap(series.data)
  const historicalData: { period: string; value: number; annotation?: string }[] = []
  const ANNOTATIONS: Record<string, string> = {
    '2020': 'COVID demand collapse',
    '2021': 'Supply chain disruptions',
    '2022': '40-year high',
  }
  for (let yr = startYear; yr <= endYear; yr++) {
    const dec = ymMap[`${yr}-M12`]
    const decPrev = ymMap[`${yr - 1}-M12`]
    if (dec !== undefined && decPrev !== undefined) {
      const entry: { period: string; value: number; annotation?: string } = {
        period: yr.toString(),
        value: +((dec - decPrev) / decPrev * 100).toFixed(1),
      }
      if (ANNOTATIONS[yr.toString()]) entry.annotation = ANNOTATIONS[yr.toString()]
      historicalData.push(entry)
    }
  }

  return {
    kpiId: 'exec-002',
    currentValue: +currentYoY.toFixed(1),
    trendValue: +trendValue.toFixed(1),
    trend: trendValue > 0.1 ? 'up' : trendValue < -0.1 ? 'down' : 'flat',
    asOfDate,
    historicalData: historicalData.sort((a, b) => +a.period - +b.period),
  }
}

/**
 * exec-003: Non-Farm Employment Growth Rate (monthly change K)
 * currentValue = latest month's job additions in thousands
 * historicalData = annual average monthly additions per year
 */
export async function fetchPayroll(startYear: number, endYear: number): Promise<LiveKPIUpdate> {
  const [series] = await fetchBLSSeries([PAYROLL_SERIES], startYear - 1, endYear)
  const points = sortNewestFirst(series.data) // payroll levels, newest first

  if (points.length < 2) throw new Error('Insufficient payroll data')

  // Latest monthly change (K)
  const currentChange = parseFloat(points[0].value) - parseFloat(points[1].value)
  const prevChange =
    points.length >= 3
      ? parseFloat(points[1].value) - parseFloat(points[2].value)
      : currentChange
  const trendValue = currentChange - prevChange

  const p0 = points[0]
  const month = parseInt(p0.period.slice(1))
  const asOfDate = `${p0.year}-${String(month).padStart(2, '0')}-01`

  // Historical: average monthly change per calendar year
  const ymMap = buildYMMap(series.data)
  const ANNOTATIONS: Record<string, string> = {
    '2020': 'COVID-19 shutdowns',
    '2021': 'Recovery',
  }
  const historicalData: { period: string; value: number; annotation?: string }[] = []

  for (let yr = startYear; yr <= endYear; yr++) {
    const changes: number[] = []
    for (let m = 1; m <= 12; m++) {
      const key = `${yr}-M${String(m).padStart(2, '0')}`
      const prevKey =
        m === 1 ? `${yr - 1}-M12` : `${yr}-M${String(m - 1).padStart(2, '0')}`
      const level = ymMap[key]
      const prevLevel = ymMap[prevKey]
      if (level !== undefined && prevLevel !== undefined) {
        changes.push(level - prevLevel)
      }
    }
    if (changes.length > 0) {
      const avg = changes.reduce((s, v) => s + v, 0) / changes.length
      const entry: { period: string; value: number; annotation?: string } = {
        period: yr.toString(),
        value: Math.round(avg),
      }
      if (ANNOTATIONS[yr.toString()]) entry.annotation = ANNOTATIONS[yr.toString()]
      historicalData.push(entry)
    }
  }

  return {
    kpiId: 'exec-003',
    currentValue: Math.round(currentChange),
    trendValue: Math.round(trendValue),
    trend: trendValue > 10 ? 'up' : trendValue < -10 ? 'down' : 'flat',
    asOfDate,
    historicalData: historicalData.sort((a, b) => +a.period - +b.period),
  }
}
