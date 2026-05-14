import type { Metadata } from 'next'
import { BranchLandingPage } from '@/components/kpi/BranchLandingPage'
import { getKPIsByBranch } from '@/data/kpis'

export const metadata: Metadata = {
  title: 'Legislative Branch KPI Dashboards',
  description:
    'Performance metrics for the U.S. Congress: bill passage rates, budget timeliness, bipartisan voting, oversight effectiveness, attendance, and lobbying transparency.',
}

export default function LegislativePage() {
  const kpis = getKPIsByBranch('legislative')

  return (
    <BranchLandingPage
      branch="legislative"
      kpis={kpis}
      description="Tracking legislative productivity, congressional oversight, fiscal responsibility, member performance, and institutional transparency across the House and Senate."
      mission="The Legislative Branch KPI framework measures Congress's ability to legislate effectively, exercise oversight of the executive, pass timely budgets, engage bipartisanly, and maintain public confidence. Data draws from Congress.gov, GovTrack, ProPublica, the GAO Recommendations Database, and the Senate Lobbying Disclosure database."
      categories={[
        {
          name: 'Legislative Output',
          count: 1,
          description: 'Bill introduction, advancement, and enactment rates per Congress.',
        },
        {
          name: 'Fiscal Responsibility',
          count: 1,
          description: 'Appropriations timeliness, government shutdowns, and continuing resolutions.',
        },
        {
          name: 'Oversight Activity',
          count: 2,
          description: 'Committee hearing volume and GAO recommendation implementation.',
        },
        {
          name: 'Legislative Process',
          count: 2,
          description: 'Bipartisan voting rates and bill cycle time from introduction to enactment.',
        },
        {
          name: 'Constituent Service',
          count: 1,
          description: 'Congressional office responsiveness to constituent communications.',
        },
        {
          name: 'Member Performance',
          count: 1,
          description: 'Attendance and roll-call voting participation rates by member.',
        },
        {
          name: 'Transparency & Ethics',
          count: 1,
          description: 'Lobbying Disclosure Act compliance and filing rates.',
        },
        {
          name: 'Public Confidence',
          count: 1,
          description: 'Congressional public approval and confidence polling trends.',
        },
      ]}
    />
  )
}
