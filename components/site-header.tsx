'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Search, Cpu } from 'lucide-react'
import { Container } from '@/components/layouts/container'

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <Container size="xl">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold tracking-tight text-foreground leading-tight">Decision Support Network</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Powered by CCA</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/tools" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50">
              Browse Tools
            </Link>
            <Link href="/decision-tools" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50">
              Decision Tools
            </Link>
            <Link href="/docs" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50">
              API Docs
            </Link>
            <Link href="/about" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50">
              About
            </Link>
            <Link href="/search" className="ml-2 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50">
              <Search className="w-4 h-4" />
            </Link>
          </nav>

          <button
            className="md:hidden p-2 text-muted-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {menuOpen && (
          <nav className="md:hidden pb-4 space-y-1">
            <Link href="/tools" className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setMenuOpen(false)}>Browse Tools</Link>
            <Link href="/decision-tools" className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setMenuOpen(false)}>Decision Tools</Link>
            <Link href="/docs" className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setMenuOpen(false)}>API Docs</Link>
            <Link href="/about" className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/search" className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setMenuOpen(false)}>Search</Link>
          </nav>
        )}
      </Container>
    </header>
  )
}
