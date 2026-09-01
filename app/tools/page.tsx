import { prisma } from '@/lib/prisma'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ToolsBrowser } from './_components/tools-browser'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse All Decision Tools',
  description: 'Explore all verified CCA Decision Support Assets. Filter by category, geography, and capability.',
}

export default async function ToolsPage() {
  const tools = await prisma.dSA.findMany({
    where: { listingStatus: 'active' },
    orderBy: { name: 'asc' },
  })

  const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } })

  return (
    <>
      <SiteHeader />
      <main className="pt-20 min-h-screen">
        <ToolsBrowser tools={JSON.parse(JSON.stringify(tools ?? []))} categories={JSON.parse(JSON.stringify(categories ?? []))} />
      </main>
      <SiteFooter />
    </>
  )
}
