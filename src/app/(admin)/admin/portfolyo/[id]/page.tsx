import type { Metadata } from "next"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { PortfolioEditor } from "@/components/admin/content/portfolio-editor"

export const metadata: Metadata = { title: "Portfolyo Düzenle" }

export default async function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  if (!prisma) notFound()
  const { id } = await params
  const [item, services] = await Promise.all([
    prisma.portfolioItem.findUnique({ where: { id }, include: { services: true } }),
    prisma.service.findMany({
      select: { id: true, title: true, slug: true, isPublished: true },
      orderBy: [{ order: "asc" }, { title: "asc" }],
    }),
  ])
  if (!item) notFound()

  return <PortfolioEditor mode="edit" initial={item} services={services} />
}
