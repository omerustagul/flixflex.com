"use client"

import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Plus, Pencil, ExternalLink, Layers } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"
import { ViewToggle, type ViewMode } from "@/components/admin/view-toggle"

type ServiceCardItem = {
  id: string
  title: string
  slug: string
  icon: string
  isPublished: boolean
  parentId?: string | null
  parent?: { id: string; title: string } | null
  children?: Array<unknown>
  portfolios: Array<unknown>
}

export function ServicesPageClient({ items }: { items: ServiceCardItem[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  return (
    <div className="px-6 md:px-10 py-8 space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[var(--foreground)]">
            Hizmetler
          </h1>
          <p className="text-xs text-[var(--foreground-muted)] mt-1">
            Public hizmet listesi ve hizmet detay sayfalarını yönetin.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle mode={viewMode} onChange={setViewMode} />
          <Link href="/admin/hizmetler/new" className="ff-btn ff-btn-primary inline-flex items-center h-9 font-semibold text-xs gap-2">
            <Plus size={14} />
            Yeni Hizmet
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="ff-shape-container bg-[var(--surface-elevated)] border border-[var(--border)] py-16 text-center">
          <p className="text-[var(--foreground-muted)] text-sm">Henüz hizmet kaydı yok.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item) => (
            <ServiceCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="ff-shape-container bg-[var(--surface-elevated)] border border-[var(--border)] overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-[var(--border)] text-left">
              <tr>
                <th className="px-4 py-3 text-[10px] font-bold text-[var(--foreground-muted)]">Hizmet</th>
                <th className="px-4 py-3 text-[10px] font-bold text-[var(--foreground-muted)]">Hiyerarşi</th>
                <th className="px-4 py-3 text-[10px] font-bold text-[var(--foreground-muted)]">Durum</th>
                <th className="px-4 py-3 text-[10px] font-bold text-[var(--foreground-muted)] text-right">Aksiyonlar</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface)] transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/hizmetler/${item.id}`} className="text-[13px] font-semibold hover:text-[var(--ff-purple)] transition-colors">
                      {item.title}
                    </Link>
                    <p className="text-[11px] text-[var(--foreground-faint)] mt-0.5">/hizmetler/{item.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <HierarchyBadge item={item} />
                  </td>
                  <td className="px-4 py-3">
                    <Status published={item.isPublished} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link href={`/hizmetler/${item.slug}`} target="_blank" className="ff-shape-button border border-[var(--border)] w-7 h-7 flex items-center justify-center hover:border-[var(--ff-purple-border)] transition-colors">
                        <ExternalLink size={12} />
                      </Link>
                      <Link href={`/admin/hizmetler/${item.id}`} className="ff-shape-button border border-[var(--border)] w-7 h-7 flex items-center justify-center hover:border-[var(--ff-purple-border)] transition-colors">
                        <Pencil size={12} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function HierarchyBadge({ item }: { item: ServiceCardItem }) {
  const childCount = Array.isArray(item.children) ? item.children.length : 0

  if (childCount > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-[var(--ff-purple)] font-medium">
        <Layers size={11} />
        {childCount} alt hizmet
      </span>
    )
  }

  if (item.parent?.title) {
    return (
      <span className="text-[11px] text-[var(--foreground-faint)]">
        ← {item.parent.title}
      </span>
    )
  }

  return <span className="text-[11px] text-[var(--foreground-faint)]">—</span>
}

function ServiceCard({ item }: { item: ServiceCardItem }) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[item.icon] ?? LucideIcons.Globe
  const childCount = Array.isArray(item.children) ? item.children.length : 0

  return (
    <div className={cn(
      "ff-shape-container group relative bg-[var(--surface-elevated)] border border-[var(--border)]",
      "p-5 transition-all duration-200 hover:border-[var(--ff-purple-border)]",
      "flex flex-col"
    )}>
      <div className="absolute inset-x-0 top-0 h-px bg-[var(--ff-purple)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between gap-3">
        <div className="ff-shape-button w-10 h-10 flex items-center justify-center shrink-0" style={{ background: "rgba(161,52,255,0.1)" }}>
          <Icon size={18} className="text-[var(--ff-purple)]" />
        </div>
        <div className="flex items-center gap-1.5">
          <HierarchyBadge item={item} />
          <Status published={item.isPublished} />
        </div>
      </div>

      <div className="mt-3 space-y-2 flex-1">
        <Link
          href={`/admin/hizmetler/${item.id}`}
          className="text-sm font-semibold text-[var(--foreground)] hover:text-[var(--ff-purple)] transition-colors line-clamp-1 block"
        >
          {item.title}
        </Link>
        <p className="text-[11px] text-[var(--foreground-faint)]">
          /hizmetler/{item.slug}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 mt-3 border-t border-[var(--border)]">
        <span className="text-[11px] text-[var(--foreground-muted)]">
          {item.portfolios.length} proje
          {childCount > 0 && <span> · {childCount} alt</span>}
        </span>
        <div className="flex gap-1">
          <Link
            href={`/hizmetler/${item.slug}`}
            target="_blank"
            className="ff-shape-button border border-[var(--border)] w-7 h-7 flex items-center justify-center hover:border-[var(--ff-purple-border)] transition-colors"
          >
            <ExternalLink size={12} />
          </Link>
          <Link
            href={`/admin/hizmetler/${item.id}`}
            className="ff-shape-button border border-[var(--border)] w-7 h-7 flex items-center justify-center hover:border-[var(--ff-purple-border)] transition-colors"
          >
            <Pencil size={12} />
          </Link>
        </div>
      </div>
    </div>
  )
}

function Status({ published }: { published: boolean }) {
  return (
    <span className={cn(
      "ff-shape-container px-2 py-0.5 text-[10px] border",
      published
        ? "text-[var(--success)] border-[var(--success)]/40 bg-[var(--success)]/20 backdrop-blur-sm"
        : "text-[var(--warning)] border-[var(--warning)]/40 bg-[var(--warning)]/20 backdrop-blur-sm"
    )}>
      {published ? "Yayında" : "Taslak"}
    </span>
  )
}
