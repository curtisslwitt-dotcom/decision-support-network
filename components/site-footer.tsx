import Link from 'next/link'
import { Container } from '@/components/layouts/container'
import { Cpu } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-background/50">
      <Container size="xl">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-display text-sm font-bold">Decision Support Network</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Connecting people and AI agents with verified decision-support tools. Powered by CCA.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Discover</h4>
            <div className="space-y-2">
              <Link href="/tools" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Browse All Tools</Link>
              <Link href="/decision-tools" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Decision Tools</Link>
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">About CCA</Link>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">For AI Agents</h4>
            <div className="space-y-2">
              <Link href="/docs" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">API Documentation</Link>
              <Link href="/decision-tools#mcp" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">MCP Endpoint</Link>
              <Link href="/decision-tools#webmcp" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Browser WebMCP</Link>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trust</h4>
            <div className="space-y-2">
              <Link href="/about#verification" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Verification Standard</Link>
              <span className="block text-sm text-muted-foreground/50 cursor-default">Submit a DSA <span className="text-xs">(Coming Soon)</span></span>
            </div>
          </div>
        </div>
        <div className="py-6 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground/60">
            © 2026 CCA · Decision Support Network · Routing service only. Safety boundaries governed by individual DSAs.
          </p>
        </div>
      </Container>
    </footer>
  )
}
