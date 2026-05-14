export type Branch = 'executive' | 'legislative' | 'judicial'
export type RefreshFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'
export type ChartType = 'line' | 'bar' | 'area' | 'heatmap' | 'scatter' | 'gauge' | 'table'
export type DataQuality = 'high' | 'medium' | 'low' | 'estimated'
export type TrendDirection = 'up' | 'down' | 'flat'

export interface DataSource {
  name: string
  shortName: string
  url: string
  apiAvailable: boolean
  updateFrequency: string
  agency: string
  notes?: string
}

export interface DataPoint {
  period: string     // ISO date or "YYYY-Q1" or "YYYY"
  value: number
  label?: string
  annotation?: string
}

export interface KPIMetric {
  currentValue: number | null
  unit: string        // e.g. "%", "days", "billions USD"
  displayFormat: string  // e.g. "{value}%", "${value}B", "{value} days"
  benchmark?: number
  benchmarkLabel?: string
  trend: TrendDirection
  trendValue?: number   // change from prior period
  trendPeriod?: string  // e.g. "vs. prior year"
  dataQuality: DataQuality
  asOfDate?: string
}

export interface KPI {
  id: string
  slug: string
  name: string
  shortName: string
  branch: Branch
  category: string
  tagline: string
  whatItMeasures: string
  formula?: string
  formulaNote?: string
  whyItMatters: string
  dataSources: DataSource[]
  suggestedCharts: ChartType[]
  refreshFrequency: RefreshFrequency
  drillDownOptions: string[]
  dataCaveats: string[]
  relatedKPIIds: string[]
  tags: string[]
  metric?: KPIMetric
  historicalData?: DataPoint[]
  status: 'active' | 'planned'
  featured?: boolean
  sampleDashboardDescription?: string
}

export interface BranchSummary {
  branch: Branch
  label: string
  description: string
  kpiCount: number
  featuredKPIs: string[]
  color: string
  bgClass: string
  icon: string
}

export interface ContactRequest {
  name: string
  email: string
  organization?: string
  requestType: 'new-kpi' | 'data-error' | 'source-suggestion' | 'general'
  message: string
  branch?: Branch
}
