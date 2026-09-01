export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { findDecisionSupportTools } from '@/lib/routing-engine'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const query = body?.query as string | undefined
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400, headers: corsHeaders })
    }

    const result = await findDecisionSupportTools(query, {
      geography: body?.geography,
      category: body?.category,
      audience: body?.audience,
      maxResults: body?.max_results ?? 5,
    })

    return NextResponse.json(result, { headers: corsHeaders })
  } catch (error: any) {
    console.error('Find tool error:', error)
    return NextResponse.json({ error: 'Routing engine error' }, { status: 500, headers: corsHeaders })
  }
}
