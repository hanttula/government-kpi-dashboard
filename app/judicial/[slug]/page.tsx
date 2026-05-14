import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { KPIDetailView } from '@/components/kpi/KPIDetailView'
import { judicialKPIs } from '@/data/kpis/judicial'
import { getRelatedKPIs } from '@/data/kpis'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return judicialKPIs.map((k) => ({ slug: k.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const kpi = judicialKPIs.find((k) => k.slug === params.slug)
  if (!kpi) return {}
  return {
    title: `${kpi.name} — Judicial Branch KPI`,
    description: kpi.tagline,
  }
}

export default function JudicialKPIPage({ params }: Props) {
  const kpi = judicialKPIs.find((k) => k.slug === params.slug)
  if (!kpi) notFound()

  return <KPIDetailView kpi={kpi} relatedKPIs={getRelatedKPIs(kpi)} />
}
