/**
 * Merges a static KPI definition with live data from the database.
 * Live DB values override the static fallbacks when available.
 * Falls back gracefully to static data if the DB has no record yet.
 */
import { db } from '@/lib/db'
import type { KPI, TrendDirection } from '@/lib/types'

export async function withLiveData(kpi: KPI): Promise<KPI> {
  const [live, points] = await Promise.all([
    db.kPILiveData.findUnique({ where: { kpiId: kpi.id } }),
    db.kPIHistoricalPoint.findMany({
      where: { kpiId: kpi.id },
      orderBy: { period: 'asc' },
    }),
  ])

  return {
    ...kpi,
    metric:
      live && kpi.metric
        ? {
            ...kpi.metric,
            currentValue: live.currentValue,
            trend: live.trend as TrendDirection,
            trendValue: live.trendValue,
            asOfDate: live.asOfDate,
          }
        : kpi.metric,
    historicalData:
      points.length > 0
        ? points.map((p) => ({
            period: p.period,
            value: p.value,
            ...(p.annotation ? { annotation: p.annotation } : {}),
          }))
        : kpi.historicalData,
  }
}
