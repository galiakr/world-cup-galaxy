import { NextResponse } from 'next/server'
import { fetchSquad } from '@/lib/api'

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const result = await fetchSquad(code)
  return NextResponse.json(result)
}
