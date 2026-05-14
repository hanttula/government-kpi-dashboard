import type { Metadata } from 'next'
import { BranchLandingPage } from '@/components/kpi/BranchLandingPage'
import { getKPIsByBranch } from '@/data/kpis'

export const metadata: Metadata = {
  title: 'Judicial Branch KPI Dashboards',
  description:
    'Performance metrics for the U.S. federal court system: case clearance rates, backlogs, resolution times, judicial vacancies, and public confidence in courts.',
}

export default function JudicialPage() {
  const kpis = getKPIsByBranch('judicial')

  return (
    <BranchLandingPage
      branch="judicial"
      kpis={kpis}
      description="Tracking the federal court system's capacity, efficiency, equity, and public legitimacy — from the district courts through the Supreme Court."
      mission="The Judicial Branch KPI framework measures whether federal courts are managing their caseloads sustainably, how long litigants wait for resolution, whether representation and access are equitable, and whether the public retains confidence in the judiciary. Data draws from the Administrative Office of the U.S. Courts, the Federal Judicial Center, the U.S. Sentencing Commission, and major polling organizations."
      categories={[
        {
          name: 'Court Capacity',
          count: 3,
          description: 'Clearance rates, pending caseload volumes, and judicial vacancy rates.',
        },
        {
          name: 'Court Efficiency',
          count: 1,
          description: 'Median case resolution time from filing to disposition.',
        },
        {
          name: 'Judicial Quality',
          count: 2,
          description: 'Appellate reversal rates and sentencing consistency index.',
        },
        {
          name: 'Criminal Justice',
          count: 2,
          description: 'Pretrial detention duration and access to counsel rates.',
        },
        {
          name: 'Access to Justice',
          count: 2,
          description: 'Legal representation rates and digital court access availability.',
        },
        {
          name: 'Public Confidence',
          count: 1,
          description: 'Public confidence in the federal judiciary and Supreme Court.',
        },
      ]}
    />
  )
}
