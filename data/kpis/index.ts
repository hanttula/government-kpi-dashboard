import type { KPI, Branch } from '@/lib/types'
import { executiveKPIs } from './executive'
import { legislativeKPIs } from './legislative'
import { judicialKPIs } from './judicial'

export const allKPIs: KPI[] = [
  ...executiveKPIs,
  ...legislativeKPIs,
  ...judicialKPIs,
]

export function getKPIsByBranch(branch: Branch): KPI[] {
  return allKPIs.filter((k) => k.branch === branch)
}

export function getKPIBySlug(slug: string): KPI | undefined {
  return allKPIs.find((k) => k.slug === slug)
}

export function getFeaturedKPIs(branch?: Branch): KPI[] {
  return allKPIs.filter((k) => k.featured && (!branch || k.branch === branch))
}

export function getRelatedKPIs(kpi: KPI): KPI[] {
  return kpi.relatedKPIIds
    .map((id) => allKPIs.find((k) => k.id === id))
    .filter(Boolean) as KPI[]
}

export function searchKPIs(query: string, branch?: Branch): KPI[] {
  const q = query.toLowerCase()
  return allKPIs.filter((k) => {
    if (branch && k.branch !== branch) return false
    return (
      k.name.toLowerCase().includes(q) ||
      k.tagline.toLowerCase().includes(q) ||
      k.category.toLowerCase().includes(q) ||
      k.tags.some((t) => t.toLowerCase().includes(q))
    )
  })
}

export { executiveKPIs, legislativeKPIs, judicialKPIs }
