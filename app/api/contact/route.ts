import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const STORE_PATH = path.join(process.cwd(), 'data', 'contact-requests.json')

interface ContactRequest {
  id: string
  submittedAt: string
  requestType: string
  name: string
  email: string
  org: string
  branch: string
  message: string
}

async function readStore(): Promise<ContactRequest[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf-8')
    return JSON.parse(raw) as ContactRequest[]
  } catch {
    return []
  }
}

async function writeStore(entries: ContactRequest[]): Promise<void> {
  const dir = path.dirname(STORE_PATH)
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(STORE_PATH, JSON.stringify(entries, null, 2), 'utf-8')
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const { requestType, name, email, org, branch, message } = body as Record<string, string>

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  const entry: ContactRequest = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    submittedAt: new Date().toISOString(),
    requestType: requestType || 'general',
    name: name.trim(),
    email: email.trim(),
    org: org?.trim() ?? '',
    branch: branch?.trim() ?? '',
    message: message.trim(),
  }

  try {
    const existing = await readStore()
    await writeStore([...existing, entry])
  } catch (err) {
    console.error('Failed to write contact request:', err)
    return NextResponse.json({ error: 'Failed to save request. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
