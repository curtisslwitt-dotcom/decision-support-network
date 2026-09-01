export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } })
    
    // Count DSAs per category
    const counts = await prisma.dSA.groupBy({
      by: ['categorySlug'],
      where: { listingStatus: 'active' },
      _count: true,
    })

    const countMap = new Map(counts.map((c: any) => [c.categorySlug, c._count]))

    const result = categories.map((cat: any) => ({
      ...cat,
      dsaCount: countMap.get(cat?.slug) ?? 0,
    }))

    return NextResponse.json({ categories: result }, { headers: corsHeaders })
  } catch (error: any) {
    console.error('Categories error:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500, headers: corsHeaders })
  }
}
