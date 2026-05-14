import type { Metadata } from 'next'
import { BranchLandingPage } from '@/components/kpi/BranchLandingPage'
import { getKPIsByBranch } from '@/data/kpis'

export const metadata: Metadata = {
  title: 'Executive Branch KPI Dashboards',
  description:
    'Performance metrics for the U.S. Executive Branch: budget execution, inflation, employment, agency service delivery, national debt, and more.',
}

export default function ExecutivePage() {
  const kpis = getKPIsByBranch('executive')

  return (
    <BranchLandingPage
      branch="executive"
      kpis={kpis}
      description="Tracking operational performance, fiscal management, economic outcomes, and agency service delivery across the federal executive branch."
      mission="The Executive Branch KPI framework measures whether federal agencies are operating efficiently, whether major economic indicators are moving in the right direction, and whether the government is delivering services to citizens in a timely and accountable manner. Metrics draw from BLS, BEA, Treasury, OMB, FEMA, and agency-level data."
      categories={[
        {
          name: 'Fiscal Management',
          count: 2,
          description: 'Budget execution accuracy, national debt trajectory, and deficit trends.',
        },
        {
          name: 'Macroeconomic Performance',
          count: 2,
          description: 'Inflation trends vs. Federal Reserve target and employment growth.',
        },
        {
          name: 'Agency Operations',
          count: 2,
          description: 'Federal service delivery times and procurement competition rates.',
        },
        {
          name: 'Emergency Management',
          count: 1,
          description: 'FEMA disaster declaration speed and assistance disbursement timeliness.',
        },
        {
          name: 'Regulatory Activity',
          count: 1,
          description: 'Regulatory processing time from proposed rule to final publication.',
        },
        {
          name: 'Border & Immigration',
          count: 1,
          description: 'Immigration court throughput and case backlog volume.',
        },
        {
          name: 'Public Confidence',
          count: 1,
          description: 'Public trust in the federal government (Pew, Gallup, ANES).',
        },
      ]}
    />
  )
}
