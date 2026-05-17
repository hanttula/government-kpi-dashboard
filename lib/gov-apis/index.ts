import { db } from '@/lib/db'
import { fetchInflation, fetchPayroll } from './bls'
import { fetchDebtToGDP } from './fred'
import { fetchBillPassageEfficiency } from './congress'
import type { LiveKPIUpdate } from './types'

export type { LiveKPIUpdate }

async function runSafe(
  name: string,
  fn: () => Promise<LiveKPIUpdate>,
): Promise<LiveKPIUpdate | null> {
  try {
    const result = await fn()
    console.log(`[cron] ✓ ${name} → kpiId=${result.kpiId}, value=${result.currentValue}`)
    return result
  } catch (err) {
    console.error(`[cron] ✗ ${name}:`, err)
    return null
  }
}

async function saveUpdate(update: LiveKPIUpdate): Promise<void> {
  // Upsert current value
  await db.kPILiveData.upsert({
    where: { kpiId: update.kpiId },
    create: {
      kpiId: update.kpiId,
      currentValue: update.currentValue,
      trendValue: update.trendValue,
      trend: update.trend,
      asOfDate: update.asOfDate,
    },
    update: {
      currentValue: update.currentValue,
      trendValue: update.trendValue,
      trend: update.trend,
      asOfDate: update.asOfDate,
    },
  })

  // Upsert each historical data point
  for (const point of update.historicalData) {
    await db.kPIHistoricalPoint.upsert({
      where: { kpiId_period: { kpiId: update.kpiId, period: point.period } },
      create: {
        kpiId: update.kpiId,
        period: point.period,
        value: point.value,
        annotation: point.annotation ?? null,
      },
      update: {
        value: point.value,
        annotation: point.annotation ?? null,
      },
    })
  }
}

export async function runAllUpdates(): Promise<{
  success: string[]
  failed: string[]
  skipped: string[]
}> {
  const currentYear = new Date().getFullYear()
  const startYear = currentYear - 9 // 10 years of history

  type Fetcher = { name: string; fn: () => Promise<LiveKPIUpdate>; requires?: string }

  const fetchers: Fetcher[] = [
    {
      name: 'BLS CPI Inflation (exec-002)',
      fn: () => fetchInflation(startYear, currentYear),
    },
    {
      name: 'BLS Nonfarm Payroll (exec-003)',
      fn: () => fetchPayroll(startYear, currentYear),
    },
    {
      name: 'FRED Debt/GDP (exec-005)',
      fn: fetchDebtToGDP,
      requires: 'FRED_API_KEY',
    },
    {
      name: 'Congress.gov Bill Passage (leg-001)',
      fn: fetchBillPassageEfficiency,
      requires: 'CONGRESS_API_KEY',
    },
  ]

  const success: string[] = []
  const failed: string[] = []
  const skipped: string[] = []

  for (const fetcher of fetchers) {
    // Skip if required env var is missing
    if (fetcher.requires && !process.env[fetcher.requires]) {
      console.log(`[cron] ↷ ${fetcher.name} skipped (${fetcher.requires} not set)`)
      skipped.push(fetcher.name)
      continue
    }

    const result = await runSafe(fetcher.name, fetcher.fn)
    if (result) {
      await saveUpdate(result)
      success.push(fetcher.name)
    } else {
      failed.push(fetcher.name)
    }
  }

  return { success, failed, skipped }
}
