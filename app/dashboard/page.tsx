import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions, DEFAULT_PREFERENCES } from '@/lib/auth'
import { db } from '@/lib/db'
import { allKPIs, getKPIsByBranch } from '@/data/kpis'
import { PersonalDashboard } from '@/components/dashboard/PersonalDashboard'
import type { Branch } from '@/lib/types'

export const metadata: Metadata = {
  title: 'My Dashboard',
  description: 'Your personalized government KPI dashboard.',
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/auth/signin?callbackUrl=/dashboard')

  // Load saved preferences from DB
  let dbPrefs = await db.userKPIPreference.findMany({
    where: { userId: session.user.id },
    orderBy: [{ branch: 'asc' }, { position: 'asc' }],
  })

  // First visit: seed defaults if none saved
  if (dbPrefs.length === 0) {
    // createMany with SQLite doesn't support skipDuplicates; use individual upserts
    for (const p of DEFAULT_PREFERENCES) {
      await db.userKPIPreference.upsert({
        where: { userId_kpiId: { userId: session.user.id, kpiId: p.kpiId } },
        create: { userId: session.user.id, branch: p.branch, kpiId: p.kpiId, position: p.position },
        update: {},
      })
    }
    dbPrefs = await db.userKPIPreference.findMany({
      where: { userId: session.user.id },
      orderBy: [{ branch: 'asc' }, { position: 'asc' }],
    })
  }

  // Shape into { branch, kpiIds[] } per branch
  const branches: Branch[] = ['executive', 'legislative', 'judicial']
  const initialPrefs = branches.map((branch) => ({
    branch,
    kpiIds: dbPrefs.filter((p) => p.branch === branch).map((p) => p.kpiId),
  }))

  const kpisByBranch = {
    executive: getKPIsByBranch('executive'),
    legislative: getKPIsByBranch('legislative'),
    judicial: getKPIsByBranch('judicial'),
  }

  return (
    <PersonalDashboard
      userName={session.user.name ?? session.user.email ?? 'there'}
      initialPrefs={initialPrefs}
      kpisByBranch={kpisByBranch}
      allKPIs={allKPIs}
    />
  )
}
