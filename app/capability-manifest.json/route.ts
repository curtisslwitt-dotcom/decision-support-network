export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'https://localhost:3000'
  
  return NextResponse.json({
    name: 'Decision Support Network',
    organization: 'CCA',
    category: 'Directory / Routing Infrastructure',
    purpose: 'Discover and route to verified Decision Support Assets for humans and AI agents',
    humanUrl: `${baseUrl}/`,
    decisionToolsUrl: `${baseUrl}/decision-tools`,
    webmcp: {
      available: true,
      tools: ['find_decision_support_tool', 'get_decision_tool_details', 'list_decision_support_categories'],
    },
    restApi: { available: true, url: `${baseUrl}/api/v1` },
    openApi: { url: `${baseUrl}/openapi.json`, docsUrl: `${baseUrl}/docs` },
    remoteMcp: { available: true, url: `${baseUrl}/api/mcp` },
    safetyLimitations: 'Routing service only. Does not independently diagnose, advise, or guarantee outcomes. Safety boundaries are governed by individual listed DSAs.',
    verificationStandard: 'CCA Verified',
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  })
}
