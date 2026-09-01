export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'https://localhost:3000'

  return NextResponse.json({
    name: 'Decision Support Network',
    description: 'CCA verified Decision Support Asset discovery and routing',
    url: `${baseUrl}/api/mcp`,
    transport: 'http',
    tools: [
      'find_decision_support_tool',
      'get_decision_tool_details',
      'list_decision_support_categories',
    ],
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  })
}
