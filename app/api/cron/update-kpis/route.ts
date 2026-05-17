import { NextResponse } from 'next/server'
import { runAllUpdates } from '@/lib/gov-apis'

export const dynamic = 'force-dynamic'

/**
 * GET /api/cron/update-kpis
 *
 * Protected by CRON_SECRET — Vercel automatically sends
 * `Authorization: Bearer <CRON_SECRET>` when invoking scheduled crons.
 * You can also trigger it manually with the same header.
 */
export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const started = Date.now()

  try {
    const result = await runAllUpdates()
    return NextResponse.json({
      ok: true,
      ...result,
      durationMs: Date.now() - started,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[cron] Fatal error:', err)
    return NextResponse.json(
      { ok: false, error: String(err), durationMs: Date.now() - started },
      { status: 500 },
    )
  }
}
