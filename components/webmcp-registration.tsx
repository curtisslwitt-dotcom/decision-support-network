'use client'

import { useEffect } from 'react'

export function WebMCPRegistration() {
  useEffect(() => {
    const doc = document as any
    if (!doc?.modelContext?.registerTool) return

    // Tool 1: find_decision_support_tool
    doc.modelContext.registerTool({
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
      handler: async (args: any) => {
        try {
          const res = await fetch('/api/v1/find-tool', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(args),
          })
          return await res.json()
        } catch (e: any) {
          return { error: e?.message ?? 'Failed to find tool' }
        }
      },
    })

    // Tool 2: get_decision_tool_details
    doc.modelContext.registerTool({
      name: 'get_decision_tool_details',
      description: 'Get full details of a specific Decision Support Asset by slug',
      inputSchema: {
        type: 'object',
        properties: {
          slug: { type: 'string', description: 'The DSA slug identifier' },
        },
        required: ['slug'],
      },
      handler: async (args: any) => {
        try {
          const res = await fetch(`/api/v1/tools/${encodeURIComponent(args?.slug ?? '')}`)
          return await res.json()
        } catch (e: any) {
          return { error: e?.message ?? 'Failed to get tool details' }
        }
      },
    })

    // Tool 3: list_decision_support_categories
    doc.modelContext.registerTool({
      name: 'list_decision_support_categories',
      description: 'List all available decision support categories with DSA counts',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      handler: async () => {
        try {
          const res = await fetch('/api/v1/categories')
          return await res.json()
        } catch (e: any) {
          return { error: e?.message ?? 'Failed to list categories' }
        }
      },
    })
  }, [])

  return null
}
