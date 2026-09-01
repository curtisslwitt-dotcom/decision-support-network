import { prisma } from '@/lib/prisma'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WebMCPRegistration } from '@/components/webmcp-registration'
import { HomeHero } from './_components/home-hero'
import { CategoryGrid } from './_components/category-grid'
import { FeaturedTools } from './_components/featured-tools'
import { HowItWorks } from './_components/how-it-works'
import { ForAgents } from './_components/for-agents'
import { TrustSection } from './_components/trust-section'

export default async function HomePage() {
  const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } })
  const counts = await prisma.dSA.groupBy({
    by: ['categorySlug'],
    where: { listingStatus: 'active' },
    _count: true,
  })
  const countMap = new Map(counts.map((c: any) => [c.categorySlug, c._count]))
  const categoriesWithCounts = categories.map((cat: any) => ({
    ...(cat ?? {}),
    dsaCount: countMap.get(cat?.slug) ?? 0,
  }))

  const featuredTools = await prisma.dSA.findMany({
    where: { listingStatus: 'active', featured: true },
    orderBy: { featuredOrder: 'asc' },
    take: 4,
  })

  const allTools = featuredTools?.length > 0 ? featuredTools : await prisma.dSA.findMany({
    where: { listingStatus: 'active' },
    orderBy: { name: 'asc' },
    take: 4,
  })

  return (
    <>
      <WebMCPRegistration />
      <SiteHeader />
      <main>
        <HomeHero />
        <CategoryGrid categories={categoriesWithCounts} />
        <FeaturedTools tools={allTools} />
        <HowItWorks />
        <ForAgents />
        <TrustSection />
      </main>
      <SiteFooter />
    </>
  )
}
