'use client'

import { ExternalLink, Code, Radio, Globe, Cpu } from 'lucide-react'
import { Container } from '@/components/layouts/container'
import { FadeIn } from '@/components/ui/animate'
import Link from 'next/link'

export function DecisionToolsContent() {
  return (
    <Container size="lg">
      <div className="py-10 space-y-10">
        <FadeIn>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">Decision Tools</h1>
          <p className="text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            The Decision Support Network provides four ways to discover and use verified decision-support tools.
            Every interface calls the same canonical routing engine — results are consistent whether you&apos;re a person using the website, an AI agent calling the API, or a browser assistant using WebMCP.
          </p>
        </FadeIn>

        {/* Human UI */}
        <FadeIn delay={0.05}>
          <div className="p-6 rounded-xl bg-card/40 border border-border/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <ExternalLink className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="font-display text-xl font-semibold">Human Interface</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Search, browse, filter, and visit any tool directly through this website.</p>
            <div className="flex gap-3">
              <Link href="/" className="text-sm text-primary hover:underline">Homepage Search</Link>
              <Link href="/tools" className="text-sm text-primary hover:underline">Browse All Tools</Link>
            </div>
          </div>
        </FadeIn>

        {/* WebMCP */}
        <FadeIn delay={0.1}>
          <div id="webmcp" className="p-6 rounded-xl bg-card/40 border border-border/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="font-display text-xl font-semibold">Browser WebMCP</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Three tools are registered on this page via <code className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono">document.modelContext.registerTool()</code> for compatible AI browsers.
            </p>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#0a0d16] border border-border/10">
                <code className="text-sm font-mono text-blue-400">find_decision_support_tool</code>
                <p className="text-xs text-muted-foreground mt-1">Find relevant DSAs for a decision query. Input: query, geography?, category?, audience?, max_results?</p>
              </div>
              <div className="p-3 rounded-lg bg-[#0a0d16] border border-border/10">
                <code className="text-sm font-mono text-blue-400">get_decision_tool_details</code>
                <p className="text-xs text-muted-foreground mt-1">Get full details for a specific DSA by slug.</p>
              </div>
              <div className="p-3 rounded-lg bg-[#0a0d16] border border-border/10">
                <code className="text-sm font-mono text-blue-400">list_decision_support_categories</code>
                <p className="text-xs text-muted-foreground mt-1">List all categories with DSA counts.</p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* REST API */}
        <FadeIn delay={0.15}>
          <div id="rest" className="p-6 rounded-xl bg-card/40 border border-border/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Code className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="font-display text-xl font-semibold">REST API</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Versioned JSON API at <code className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">/api/v1/</code></p>
            <div className="space-y-2 mb-4">
              <div className="p-2.5 rounded-lg bg-[#0a0d16] border border-border/10 flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-green-400 w-10">GET</span>
                <span className="text-sm font-mono text-muted-foreground">/api/v1/tools</span>
                <span className="text-xs text-muted-foreground/60 ml-auto">List + filter tools</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0a0d16] border border-border/10 flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-green-400 w-10">GET</span>
                <span className="text-sm font-mono text-muted-foreground">/api/v1/tools/:slug</span>
                <span className="text-xs text-muted-foreground/60 ml-auto">Tool details</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0a0d16] border border-border/10 flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-blue-400 w-10">POST</span>
                <span className="text-sm font-mono text-muted-foreground">/api/v1/find-tool</span>
                <span className="text-xs text-muted-foreground/60 ml-auto">Intent-based routing</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0a0d16] border border-border/10 flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-green-400 w-10">GET</span>
                <span className="text-sm font-mono text-muted-foreground">/api/v1/categories</span>
                <span className="text-xs text-muted-foreground/60 ml-auto">Category list</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/openapi.json" className="text-sm text-primary hover:underline" target="_blank">OpenAPI Spec</Link>
              <Link href="/docs" className="text-sm text-primary hover:underline">API Documentation</Link>
            </div>
          </div>
        </FadeIn>

        {/* MCP */}
        <FadeIn delay={0.2}>
          <div id="mcp" className="p-6 rounded-xl bg-card/40 border border-border/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Radio className="w-5 h-5 text-amber-400" />
              </div>
              <h2 className="font-display text-xl font-semibold">Remote MCP</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              JSON-RPC 2.0 endpoint at <code className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">POST /api/mcp</code>
            </p>
            <div className="p-4 rounded-lg bg-[#0a0d16] border border-border/10 overflow-x-auto mb-4">
              <pre className="text-xs font-mono text-muted-foreground">{`// Example: tools/call
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "find_decision_support_tool",
    "arguments": {
      "query": "I need grant readiness help",
      "geography": "National"
    }
  }
}`}</pre>
            </div>
            <p className="text-sm text-muted-foreground">
              Supports: <code className="text-xs font-mono text-amber-400">initialize</code>, <code className="text-xs font-mono text-amber-400">tools/list</code>, <code className="text-xs font-mono text-amber-400">tools/call</code>
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div className="p-6 rounded-xl bg-card/40 border border-border/20">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-5 h-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">Discovery Documents</h2>
            </div>
            <div className="space-y-2">
              <a href="/capability-manifest.json" target="_blank" rel="noopener noreferrer" className="block text-sm text-primary hover:underline">/capability-manifest.json</a>
              <a href="/openapi.json" target="_blank" rel="noopener noreferrer" className="block text-sm text-primary hover:underline">/openapi.json</a>
              <a href="/.well-known/mcp.json" target="_blank" rel="noopener noreferrer" className="block text-sm text-primary hover:underline">/.well-known/mcp.json</a>
            </div>
          </div>
        </FadeIn>
      </div>
    </Container>
  )
}
