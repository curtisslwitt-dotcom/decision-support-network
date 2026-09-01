'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, ArrowRight, LayoutGrid } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function HomeHero() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query?.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-image.jpeg"
          alt="Illuminated highway interchange representing decision routing infrastructure"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d14]/70 via-[#0a0d14]/50 to-[#0a0d14]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d14]/60 via-transparent to-[#0a0d14]/60" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Find the Right Tool<br />
            <span className="text-primary">for the Decision</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The CCA Decision Support Network connects people and AI agents with useful tools designed to help make better-informed decisions.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-blue-400/30 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative flex items-center bg-[#0f1219] rounded-xl border border-white/10">
              <Search className="w-5 h-5 text-muted-foreground ml-4 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What decision are you trying to make?"
                className="flex-1 bg-transparent text-white placeholder:text-muted-foreground px-4 py-4 text-base outline-none"
                aria-label="Decision search query"
              />
              <button
                type="submit"
                className="mr-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm rounded-lg transition-colors flex items-center gap-2 shrink-0"
              >
                Find a Decision Tool
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex justify-center"
        >
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-white/60 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all hover:bg-white/5"
          >
            <LayoutGrid className="w-4 h-4" />
            Browse All Tools
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
