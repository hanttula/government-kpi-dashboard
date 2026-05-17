/**
 * Congress.gov API — optional, requires CONGRESS_API_KEY env var
 * Free key: https://api.congress.gov/sign-up/
 *
 * Fetches leg-001: Bill Passage Efficiency (% of introduced bills enacted)
 */
import type { LiveKPIUpdate } from './types'

const BASE = 'https://api.congress.gov/v3'

// Maps congress number → human-readable label
const CONGRESS_LABELS: Record<number, string> = {
  115: '115th (2017–18)',
  116: '116th (2019–20)',
  117: '117th (2021–22)',
  118: '118th (2023–24)',
  119: '119th (2025–26)',
}

// Approximate current congress number from year
function currentCongressNum(): number {
  return Math.floor((new Date().getFullYear() - 1789) / 2) + 1
}

async function getCongressStats(
  congress: number,
  apiKey: string,
): Promise<{ rate: number; label: string } | null> {
  try {
    // Total bills introduced — use limit=1 to just get pagination count
    const introRes = await fetch(
      `${BASE}/bill?congress=${congress}&limit=1&api_key=${apiKey}`,
      { cache: 'no-store' },
    )
    if (!introRes.ok) return null
    const introJson = await introRes.json()
    const total: number = introJson.pagination?.count ?? 0
    if (total === 0) return null

    // Enacted bills — status 'enr' (enrolled = passed both chambers, sent to president)
    // For signed-into-law we'd need to filter by action, but enr is the best available
    let enacted = 0
    let offset = 0
    const pageSize = 250
    while (true) {
      const enactedRes = await fetch(
        `${BASE}/bill?congress=${congress}&type=enr&limit=${pageSize}&offset=${offset}&api_key=${apiKey}`,
        { cache: 'no-store' },
      )
      if (!enactedRes.ok) break
      const enactedJson = await enactedRes.json()
      const bills = enactedJson.bills ?? []
      enacted += bills.length
      if (bills.length < pageSize) break
      offset += pageSize
    }

    const rate = +((enacted / total) * 100).toFixed(1)
    const label = CONGRESS_LABELS[congress] ?? `${congress}th Congress`
    return { rate, label }
  } catch {
    return null
  }
}

export async function fetchBillPassageEfficiency(): Promise<LiveKPIUpdate> {
  const apiKey = process.env.CONGRESS_API_KEY
  if (!apiKey) throw new Error('CONGRESS_API_KEY not configured')

  const current = currentCongressNum()
  const historicalData: { period: string; value: number }[] = []

  // Fetch last 4 congresses
  for (let c = current - 3; c <= current; c++) {
    const stats = await getCongressStats(c, apiKey)
    if (stats && stats.rate > 0) {
      historicalData.push({ period: stats.label, value: stats.rate })
    }
  }

  if (historicalData.length === 0) throw new Error('No Congress data retrieved')

  const latest = historicalData[historicalData.length - 1]
  const prev = historicalData[historicalData.length - 2]
  const trendValue = prev ? +(latest.value - prev.value).toFixed(1) : 0

  return {
    kpiId: 'leg-001',
    currentValue: latest.value,
    trendValue,
    trend: trendValue > 0.1 ? 'up' : trendValue < -0.1 ? 'down' : 'flat',
    asOfDate: new Date().toISOString().split('T')[0],
    historicalData,
  }
}
