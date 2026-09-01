'use client'

import { Code, Radio, Globe } from 'lucide-react'
import { Container } from '@/components/layouts/container'
import { FadeIn } from '@/components/ui/animate'
import Link from 'next/link'

export function ForAgents() {
  return (
    <section className="py-20">
      <Container size="xl">
        <FadeIn>
          <div className="rounded-2xl border border-border/30 bg-gradient-to-br from-card/80 to-[#0c1020] p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-foreground mb-4">
                  Built for AI Agents
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Every tool in the network is discoverable and callable through three machine interfaces. AI assistants can find the right tool, get details, and route decisions — using the same engine humans use.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Globe className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">Browser WebMCP</h4>
                      <p className="text-xs text-muted-foreground">Tools registered via document.modelContext for compatible AI browsers.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Code className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">REST API</h4>
                      <p className="text-xs text-muted-foreground">Versioned /api/v1/ endpoints with OpenAPI 3.1 spec.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Radio className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">Remote MCP</h4>
                      <p className="text-xs text-muted-foreground">JSON-RPC 2.0 endpoint at /api/mcp for agent frameworks.</p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/decision-tools"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm rounded-lg transition-colors"
                >
                  View All Access Methods
                </Link>
              </div>

              <div className="bg-[#0a0d16] rounded-xl border border-border/20 p-5 overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/40" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                  <div className="w-3 h-3 rounded-full bg-green-500/40" />
                  <span className="text-xs text-muted-foreground ml-2 font-mono">POST /api/v1/find-tool</span>
                </div>
                <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`// Find the right tool for any decision
const response = await fetch(
  '/api/v1/find-tool',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: "I need help evaluating
             a solar proposal",
      geography: "California",
      max_results: 3
    })
  }
);

const { tools } = await response.json();
// tools[0].dsa.name
// → "Solar Quote Analyzer"`}</pre>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}
