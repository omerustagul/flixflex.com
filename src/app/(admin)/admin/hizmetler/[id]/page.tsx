import type { Metadata } from "next"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { ServiceEditor } from "@/components/admin/content/service-editor"

export const metadata: Metadata = { title: "Hizmet Düzenle" }

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  if (!prisma) notFound()
  const { id } = await params
  const [item, allServices] = await Promise.all([
    prisma.service.findUnique({ where: { id }, include: { portfolios: true } }),
    prisma.service.findMany({ select: { id: true, title: true, slug: true }, orderBy: { order: "asc" } }),
  ])
  if (!item) notFound()

  return <ServiceEditor mode="edit" initial={item} allServices={allServices} />
}
