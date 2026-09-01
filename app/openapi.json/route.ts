export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'https://localhost:3000'

  const spec = {
    openapi: '3.1.0',
    info: {
      title: 'Decision Support Network API',
      description: 'REST API for discovering and routing to CCA verified Decision Support Assets.',
      version: '1.0.0',
      contact: { name: 'CCA', url: baseUrl },
    },
    servers: [{ url: `${baseUrl}/api/v1` }],
    paths: {
      '/tools': {
        get: {
          summary: 'List Decision Support Tools',
          description: 'Returns a paginated list of active DSAs with optional filters.',
          parameters: [
            { name: 'category', in: 'query', schema: { type: 'string' } },
            { name: 'geography', in: 'query', schema: { type: 'string' } },
            { name: 'verification', in: 'query', schema: { type: 'string' } },
            { name: 'capability', in: 'query', schema: { type: 'string', enum: ['webmcp', 'rest', 'mcp'] } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
          ],
          responses: { '200': { description: 'Paginated tool list' } },
        },
      },
      '/tools/{slug}': {
        get: {
          summary: 'Get Tool Details',
          description: 'Returns full details for a specific DSA.',
          parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Tool details' }, '404': { description: 'Not found' } },
        },
      },
      '/find-tool': {
        post: {
          summary: 'Find Decision Support Tool',
          description: 'Uses the CCA routing engine to find the most relevant DSA for a decision query.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['query'],
                  properties: {
                    query: { type: 'string', description: 'Natural-language decision query' },
                    geography: { type: 'string' },
                    category: { type: 'string' },
                    audience: { type: 'string' },
                    max_results: { type: 'integer', default: 5 },
                  },
                },
              },
            },
          },
          responses: { '200': { description: 'Ranked routing results' } },
        },
      },
      '/categories': {
        get: {
          summary: 'List Categories',
          description: 'Returns all categories with DSA counts.',
          responses: { '200': { description: 'Category list' } },
        },
      },
    },
  }

  return NextResponse.json(spec, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  })
}
