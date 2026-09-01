export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { findDecisionSupportTools } from '@/lib/routing-engine'
import { prisma } from '@/lib/prisma'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const TOOLS = [
  {
    name: 'find_decision_support_tool',
    description: 'Find relevant CCA Decision Support Assets for a given decision query',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Natural language description of the decision' },
        geography: { type: 'string', description: 'Geographic context (optional)' },
        category: { type: 'string', description: 'Category filter (optional)' },
        audience: { type: 'string', description: 'Intended audience (optional)' },
        max_results: { type: 'number', description: 'Maximum results (default: 5)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_decision_tool_details',
    description: 'Get full details of a specific Decision Support Asset by slug',
    inputSchema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'The DSA slug identifier' },
      },
      required: ['slug'],
    },
  },
  {
    name: 'list_decision_support_categories',
    description: 'List all available decision support categories with DSA counts',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
]

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { jsonrpc, id, method, params } = body ?? {}

    if (jsonrpc !== '2.0') {
      return NextResponse.json(
        { jsonrpc: '2.0', id, error: { code: -32600, message: 'Invalid JSON-RPC version' } },
        { headers: corsHeaders }
      )
    }

    let result: any

    switch (method) {
      case 'initialize':
        result = {
          protocolVersion: '2024-11-05',
          capabilities: { tools: { listChanged: false } },
          serverInfo: {
            name: 'Decision Support Network',
            version: '1.0.0',
          },
        }
        break

      case 'tools/list':
        result = { tools: TOOLS }
        break

      case 'tools/call': {
        const toolName = params?.name
        const toolArgs = params?.arguments ?? {}

        if (toolName === 'find_decision_support_tool') {
          const routingResult = await findDecisionSupportTools(toolArgs.query, {
            geography: toolArgs.geography,
            category: toolArgs.category,
            audience: toolArgs.audience,
            maxResults: toolArgs.max_results ?? 5,
          })

          await prisma.analyticsEvent.create({
            data: {
              eventType: 'mcp_find',
              interface: 'mcp',
              query: (toolArgs.query ?? '').slice(0, 200),
              topResult: routingResult?.tools?.[0]?.dsa?.slug ?? null,
              resultCount: routingResult?.totalFound ?? 0,
              noMatch: routingResult?.noMatch ?? false,
            },
          }).catch(() => {})

          result = {
            content: [{ type: 'text', text: JSON.stringify(routingResult) }],
          }
        } else if (toolName === 'get_decision_tool_details') {
          const dsa = await prisma.dSA.findUnique({ where: { slug: toolArgs.slug } })

          await prisma.analyticsEvent.create({
            data: {
              eventType: 'mcp_detail',
              interface: 'mcp',
              selectedDsa: toolArgs.slug,
            },
          }).catch(() => {})

          result = {
            content: [{ type: 'text', text: JSON.stringify(dsa ?? { error: 'Not found' }) }],
          }
        } else if (toolName === 'list_decision_support_categories') {
          const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } })
          const counts = await prisma.dSA.groupBy({
            by: ['categorySlug'],
            where: { listingStatus: 'active' },
            _count: true,
          })
          const countMap = new Map(counts.map((c: any) => [c.categorySlug, c._count]))
          const cats = categories.map((cat: any) => ({
            name: cat?.name,
            slug: cat?.slug,
            description: cat?.description,
            dsaCount: countMap.get(cat?.slug) ?? 0,
          }))

          result = {
            content: [{ type: 'text', text: JSON.stringify(cats) }],
          }
        } else {
          return NextResponse.json(
            { jsonrpc: '2.0', id, error: { code: -32601, message: `Unknown tool: ${toolName}` } },
            { headers: corsHeaders }
          )
        }
        break
      }

      default:
        return NextResponse.json(
          { jsonrpc: '2.0', id, error: { code: -32601, message: `Unknown method: ${method}` } },
          { headers: corsHeaders }
        )
    }

    return NextResponse.json({ jsonrpc: '2.0', id, result }, { headers: corsHeaders })
  } catch (error: any) {
    console.error('MCP error:', error)
    return NextResponse.json(
      { jsonrpc: '2.0', id: null, error: { code: -32603, message: 'Internal error' } },
      { status: 500, headers: corsHeaders }
    )
  }
}
