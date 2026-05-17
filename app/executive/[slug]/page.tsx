import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { KPIDetailView } from '@/components/kpi/KPIDetailView'
import { executiveKPIs } from '@/data/kpis/executive'
import { getRelatedKPIs } from '@/data/kpis'
import { withLiveData } from '@/lib/kpi-live'

// Revalidate every hour — picks up cron-updated DB values
export const revalidate = 3600

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return executiveKPIs.map((k) => ({ slug: k.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const kpi = executiveKPIs.find((k) => k.slug === params.slug)
  if (!kpi) return {}
  return {
    title: `${kpi.name} — Executive Branch KPI`,
    description: kpi.tagline,
  }
}

export default async function ExecutiveKPIPage({ params }: Props) {
  const kpi = executiveKPIs.find((k) => k.slug === params.slug)
  if (!kpi) notFound()

  const liveKpi = await withLiveData(kpi)
  return <KPIDetailView kpi={liveKpi} relatedKPIs={getRelatedKPIs(kpi)} />
}
