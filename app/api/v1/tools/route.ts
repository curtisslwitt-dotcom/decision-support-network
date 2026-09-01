export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const category = url.searchParams.get('category') ?? undefined
    const geography = url.searchParams.get('geography') ?? undefined
    const verification = url.searchParams.get('verification') ?? undefined
    const capability = url.searchParams.get('capability') ?? undefined
    const page = parseInt(url.searchParams.get('page') ?? '1', 10)
    const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50', 10), 100)

    const where: any = { listingStatus: 'active' }
    if (category) where.categorySlug = category
    if (geography) where.geography = { contains: geography }
    if (verification) where.verificationLevel = verification
    if (capability === 'webmcp') where.webMcpAvailable = true
    if (capability === 'rest') where.restApiAvailable = true
    if (capability === 'mcp') where.remoteMcpAvailable = true

    const [tools, total] = await Promise.all([
      prisma.dSA.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.dSA.count({ where }),
    ])

    // Track analytics
    await prisma.analyticsEvent.create({
      data: {
        eventType: 'list_tools',
        interface: 'rest',
        category: category ?? null,
        geography: geography ?? null,
        resultCount: tools?.length ?? 0,
      },
    }).catch(() => {})

    return NextResponse.json(
      { tools, total, page, limit, pages: Math.ceil(total / limit) },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    console.error('API tools error:', error)
    return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500, headers: corsHeaders })
  }
}
