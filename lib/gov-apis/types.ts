export interface LiveKPIUpdate {
  kpiId: string
  currentValue: number
  trendValue: number
  trend: 'up' | 'down' | 'flat'
  asOfDate: string
  historicalData: { period: string; value: number; annotation?: string }[]
}
