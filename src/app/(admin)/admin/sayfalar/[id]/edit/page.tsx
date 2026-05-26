// ═══════════════════════════════════════════════════════════
// FlixFlex Admin — Edit Page  /admin/sayfalar/[id]/edit
// Server Component — fetches PageData and mounts PageBuilder
// ═══════════════════════════════════════════════════════════

import { notFound } from "next/navigation"
import { PageBuilder } from "@/components/admin/page-builder/page-builder"
import type { PageData } from "@/types/page-builder"

// ── Fetch page by ID ──────────────────────────────
async function fetchPage(id: string): Promise<PageData | null> {
  try {
    const { prisma } = await import("@/lib/prisma")
    if (prisma) {
      const p = await prisma.page.findUnique({ 
        where: { id } 
      })

      if (!p) return null
      return {
        id:          p.id,
        slug:        p.slug,
        title:       p.title,
        description: p.description ?? undefined,
        sections:    (p.sections as unknown as PageData["sections"]) ?? [],
        status:      (p.isPublished ? "published" : "draft") as "published" | "draft",
        updatedAt:   p.updatedAt.toISOString(),
      }
    }
  } catch {
    // DB not available — fall through to in-memory
  }

  // In-memory fallback — call our own API route
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/pages/${id}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    const json = await res.json() as { success: boolean; data?: PageData }
    return json.data ?? null
  } catch {
    // Return mock home page if all else fails
    if (id === "home") {
      return {
        id:        "home",
        slug:      "/",
        title:     "Ana Sayfa",
        description: "FlixFlex ana sayfası",
        sections:  [],
        status:    "published",
        updatedAt: new Date().toISOString(),
      }
    }
    return null
  }
}

// ── Page component ────────────────────────────────
type PageProps = {
  params: Promise<{ id: string }>
}

export default async function EditPageRoute({ params }: PageProps) {
  const { id } = await params
  const page   = await fetchPage(id)

  if (!page) notFound()

  return <PageBuilder initialPage={page} />
}
