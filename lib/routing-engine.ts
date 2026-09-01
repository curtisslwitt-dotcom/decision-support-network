import { prisma } from '@/lib/prisma'

export interface RoutingResult {
  tools: Array<{
    dsa: any
    matchScore: number
    matchExplanation: string
    rank: number
  }>
  noMatch: boolean
  query: string
  totalFound: number
}

interface RoutingContext {
  geography?: string
  category?: string
  audience?: string
  maxResults?: number
}

export async function findDecisionSupportTools(
  query: string,
  context?: RoutingContext
): Promise<RoutingResult> {
  const maxResults = context?.maxResults ?? 5
  
  // Load all active DSAs
  const allDsas = await prisma.dSA.findMany({
    where: { listingStatus: 'active' },
  })

  if (!allDsas?.length) {
    return { tools: [], noMatch: true, query, totalFound: 0 }
  }

  // Build DSA summary for LLM
  const dsaSummaries = allDsas.map((d: any) => ({
    slug: d?.slug ?? '',
    name: d?.name ?? '',
    category: d?.category ?? '',
    geography: d?.geography ?? '',
    description: d?.description ?? '',
    decisionSupported: d?.decisionSupported ?? '',
    intendedAudience: d?.intendedAudience ?? '',
  }))

  const systemPrompt = `You are a decision-support routing engine. Given a user query about a decision they need help with, rank the most relevant Decision Support Assets (DSAs) from the provided list.

Rules:
- Match based on decision intent, not just keywords
- Consider geography if mentioned in the query or context
- Consider intended audience match
- Never rank a tool higher merely because it is owned by CCA
- If NO tool matches with reasonable confidence, return an empty array
- Return ONLY the JSON, no explanation outside of JSON

Return JSON in this exact format:
{
  "matches": [
    {
      "slug": "tool-slug",
      "score": 85,
      "explanation": "Matches because..."
    }
  ]
}

Respond with raw JSON only. Do not include code blocks, markdown, or any other formatting.`

  const userMessage = `Query: "${query}"
${context?.geography ? `Geography context: ${context.geography}` : ''}
${context?.category ? `Category context: ${context.category}` : ''}
${context?.audience ? `Audience context: ${context.audience}` : ''}

Available DSAs:
${JSON.stringify(dsaSummaries, null, 2)}`

  try {
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.4-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 2000,
        temperature: 0.1,
      }),
    })

    if (!response.ok) {
      console.error('LLM API error:', response.status)
      return fallbackSearch(query, allDsas, context, maxResults)
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content ?? '{}'
    
    let parsed: { matches?: Array<{ slug: string; score: number; explanation: string }> }
    try {
      parsed = JSON.parse(content)
    } catch {
      return fallbackSearch(query, allDsas, context, maxResults)
    }

    const matches = parsed?.matches ?? []
    if (!matches.length) {
      return { tools: [], noMatch: true, query, totalFound: 0 }
    }

    const dsaMap = new Map(allDsas.map((d: any) => [d?.slug, d]))
    const tools = matches
      .filter((m: any) => dsaMap.has(m?.slug) && (m?.score ?? 0) > 20)
      .slice(0, maxResults)
      .map((m: any, idx: number) => ({
        dsa: dsaMap.get(m?.slug),
        matchScore: m?.score ?? 0,
        matchExplanation: m?.explanation ?? '',
        rank: idx + 1,
      }))

    return {
      tools,
      noMatch: tools.length === 0,
      query,
      totalFound: tools.length,
    }
  } catch (error) {
    console.error('Routing engine error:', error)
    return fallbackSearch(query, allDsas, context, maxResults)
  }
}

function fallbackSearch(
  query: string,
  allDsas: any[],
  context: RoutingContext | undefined,
  maxResults: number
): RoutingResult {
  const q = query?.toLowerCase() ?? ''
  const scored = allDsas.map((dsa: any) => {
    let score = 0
    const name = (dsa?.name ?? '').toLowerCase()
    const desc = (dsa?.description ?? '').toLowerCase()
    const cat = (dsa?.category ?? '').toLowerCase()
    const geo = (dsa?.geography ?? '').toLowerCase()
    const decision = (dsa?.decisionSupported ?? '').toLowerCase()
    const audience = (dsa?.intendedAudience ?? '').toLowerCase()

    // Keyword matching
    const words = q.split(/\s+/).filter((w: string) => w.length > 2)
    for (const word of words) {
      if (name.includes(word)) score += 15
      if (desc.includes(word)) score += 10
      if (decision.includes(word)) score += 12
      if (cat.includes(word)) score += 8
      if (audience.includes(word)) score += 5
    }

    // Geography bonus
    if (context?.geography && geo.includes(context.geography.toLowerCase())) {
      score += 10
    }
    // Category bonus
    if (context?.category && cat.includes(context.category.toLowerCase())) {
      score += 10
    }

    return { dsa, score }
  })

  const filtered = scored
    .filter((s: any) => s.score > 0)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, maxResults)

  return {
    tools: filtered.map((s: any, idx: number) => ({
      dsa: s.dsa,
      matchScore: Math.min(s.score, 100),
      matchExplanation: `Keyword match for "${query}"`,
      rank: idx + 1,
    })),
    noMatch: filtered.length === 0,
    query,
    totalFound: filtered.length,
  }
}
