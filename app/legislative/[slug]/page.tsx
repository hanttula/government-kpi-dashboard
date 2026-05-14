import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { KPIDetailView } from '@/components/kpi/KPIDetailView'
import { legislativeKPIs } from '@/data/kpis/legislative'
import { getRelatedKPIs } from '@/data/kpis'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return legislativeKPIs.map((k) => ({ slug: k.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const kpi = legislativeKPIs.find((k) => k.slug === params.slug)
  if (!kpi) return {}
  return {
    title: `${kpi.name} — Legislative Branch KPI`,
    description: kpi.tagline,
  }
}

export default function LegislativeKPIPage({ params }: Props) {
  const kpi = legislativeKPIs.find((k) => k.slug === params.slug)
  if (!kpi) notFound()

  return <KPIDetailView kpi={kpi} relatedKPIs={getRelatedKPIs(kpi)} />
}
