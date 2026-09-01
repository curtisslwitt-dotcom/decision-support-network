export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { findDecisionSupportTools } from '@/lib/routing-engine'
import { prisma } from '@/lib/prisma'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const query = url.searchParams.get('q') ?? ''
    if (!query) {
      return NextResponse.json({ error: 'Query parameter q is required' }, { status: 400, headers: corsHeaders })
    }

    const result = await findDecisionSupportTools(query, {
      maxResults: 10,
    })

    await prisma.analyticsEvent.create({
      data: {
        eventType: 'search',
        interface: 'human',
        query: query.slice(0, 200),
        topResult: result?.tools?.[0]?.dsa?.slug ?? null,
        resultCount: result?.totalFound ?? 0,
        noMatch: result?.noMatch ?? false,
      },
    }).catch(() => {})

    return NextResponse.json(result, { headers: corsHeaders })
  } catch (error: any) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500, headers: corsHeaders })
  }
}
