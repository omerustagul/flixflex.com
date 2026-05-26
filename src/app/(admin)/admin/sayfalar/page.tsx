// ═══════════════════════════════════════════════════════════
// FlixFlex Admin — Page List  /admin/sayfalar
// Server Component
// ═══════════════════════════════════════════════════════════

import Link from "next/link"
import { Plus, FileText, Pencil, Copy } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { PageData, SectionBlock } from "@/types/page-builder"
import { DeletePageButton } from "./delete-page-button"

// ── Fetch helper ──────────────────────────────────
async function getPages(): Promise<PageData[]> {
  try {
    const { prisma } = await import("@/lib/prisma")
    if (prisma) {
      const rows = await prisma.page.findMany({
        orderBy: { updatedAt: "desc" }
      })
      return rows.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description ?? undefined,
        sections: (p.sections as unknown as SectionBlock[]) ?? [],
        status: (p.isPublished ? "published" : "draft") as "published" | "draft",
        updatedAt: p.updatedAt.toISOString(),
      }))
    }
  } catch {
    // DB not available
  }

  // Mock data fallback
  return [
    {
      id: "home",
      slug: "/",
      title: "Ana Sayfa",
      description: "FlixFlex ana sayfası",
      sections: [],
      status: "published",
      updatedAt: new Date().toISOString(),
    },
  ]
}

// ── Status badge ──────────────────────────────────
function StatusBadge({ status }: { status: "draft" | "published" }) {
  return (
    <span
      className={
        status === "published"
          ? "ff-shape-container px-2 py-0.5 text-[9px] font-semibold border border-emerald-400/40 text-emerald-400 bg-emerald-400/10"
          : "ff-shape-container px-2 py-0.5 text-[9px] font-semibold border border-amber-400/40 text-amber-400 bg-amber-400/10"
      }
    >
      {status === "published" ? "Yayında" : "Taslak"}
    </span>
  )
}

// ── Page ──────────────────────────────────────────
export default async function SayfalarPage() {
  const pages = await getPages()

  return (
    <div className="p-6 md:p-10 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[var(--foreground)]">
            Sayfalar
          </h1>
          <p className="text-xs text-[var(--foreground-muted)] mt-1">
            {pages.length} sayfa
          </p>
        </div>
        <Link
          href="/admin/sayfalar/yeni"
          className="ff-shape-button inline-flex items-center h-9 gap-2 px-5 py-2.5 text-[13px] font-semibold bg-[var(--ff-purple)] text-white border border-[var(--ff-purple)] hover:bg-[var(--ff-purple)] transition-colors duration-150"
        >
          <Plus size={14} />
          Yeni Sayfa
        </Link>
      </div>

      {/* Table */}
      <div className="ff-shape-container border border-[var(--border)]">
        {/* Table head */}
        <div className="grid grid-cols-[1fr_160px_120px_140px_180px] gap-0 border-b border-[var(--border)] px-4 py-2">
          {["Başlık", "Slug", "Durum", "Güncelleme", "İşlemler"].map((h) => (
            <span
              key={h}
              className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--foreground-muted)]"
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText size={24} className="text-[var(--foreground-faint)] mb-3" />
            <p className="text-sm text-[var(--foreground-muted)]">
              Henüz sayfa yok
            </p>
            <Link
              href="/admin/sayfalar/yeni"
              className="mt-4 text-[11px] text-[var(--ff-purple)] underline underline-offset-2 hover:no-underline"
            >
              İlk sayfayı oluştur
            </Link>
          </div>
        ) : (
          pages.map((page, idx) => (
            <div
              key={page.id}
              className={`grid grid-cols-[1fr_160px_120px_140px_180px] gap-0 px-4 py-3 items-center ${idx < pages.length - 1 ? "border-b border-[var(--border)]" : ""
                } hover:bg-[var(--surface)] transition-colors duration-100`}
            >
              {/* Title */}
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--foreground)] truncate">
                  {page.title}
                </p>
                {page.description && (
                  <p className="text-[11px] text-[var(--foreground-faint)] truncate mt-0.5">
                    {page.description}
                  </p>
                )}
              </div>

              {/* Slug */}
              <span className="text-[11px] font-mono text-[var(--foreground-muted)] truncate">
                {page.slug}
              </span>

              {/* Status */}
              <div>
                <StatusBadge status={page.status} />
              </div>

              {/* Updated */}
              <span className="text-[11px] text-[var(--foreground-muted)]">
                {formatDate(page.updatedAt)}
              </span>

              {/* Actions */}
              <div className="flex items-end gap-1">
                <Link
                  href={`/admin/sayfalar/${page.id}/edit`}
                  className="ff-shape-button w-9 h-9 flex items-center justify-center border border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--ff-purple)] hover:text-[var(--ff-purple)] transition-colors duration-150"
                  title="Düzenle"
                >
                  <Pencil size={14} />
                </Link>
                <Link
                  href={`/admin/sayfalar/yeni?copy=${page.id}`}
                  className="ff-shape-button w-9 h-9 flex items-center justify-center border border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--border-strong)] transition-colors duration-150"
                  title="Kopyala"
                >
                  <Copy size={14} />
                </Link>
                <DeletePageButton pageId={page.id} pageTitle={page.title} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
