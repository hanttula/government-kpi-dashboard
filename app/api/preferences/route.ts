import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import type { Branch } from '@/lib/types'

const VALID_BRANCHES: Branch[] = ['executive', 'legislative', 'judicial']
const MAX_PER_BRANCH = 3

// GET /api/preferences → returns user's saved KPI preferences
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const prefs = await db.userKPIPreference.findMany({
    where: { userId: session.user.id },
    orderBy: [{ branch: 'asc' }, { position: 'asc' }],
  })

  return NextResponse.json(prefs)
}

// PUT /api/preferences → replace all preferences for one branch
// Body: { branch: Branch, kpiIds: string[] }  (max 3 kpiIds)
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { branch, kpiIds } = body as { branch: Branch; kpiIds: string[] }

  if (!VALID_BRANCHES.includes(branch)) {
    return NextResponse.json({ error: 'Invalid branch.' }, { status: 400 })
  }
  if (!Array.isArray(kpiIds) || kpiIds.length > MAX_PER_BRANCH) {
    return NextResponse.json(
      { error: `Select at most ${MAX_PER_BRANCH} KPIs per branch.` },
      { status: 400 }
    )
  }
  // Deduplicate
  const unique = Array.from(new Set(kpiIds)).slice(0, MAX_PER_BRANCH)

  // Replace in a transaction: delete existing for this branch, insert new
  await db.$transaction([
    db.userKPIPreference.deleteMany({
      where: { userId: session.user.id, branch },
    }),
    ...unique.map((kpiId, i) =>
      db.userKPIPreference.create({
        data: { userId: session.user.id, branch, kpiId, position: i + 1 },
      })
    ),
  ])

  const updated = await db.userKPIPreference.findMany({
    where: { userId: session.user.id },
    orderBy: [{ branch: 'asc' }, { position: 'asc' }],
  })

  return NextResponse.json(updated)
}
